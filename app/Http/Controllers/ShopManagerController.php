<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Inquiry;
use App\Models\InquiryStatusHistory;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ShopManagerController extends Controller
{
    protected function getShop(Request $request): Shop
    {
        $user = $request->user();

        // 1. If Admin is accessing/impersonating a specific shop
        if ($user->isAdmin() || $user->hasRole('admin')) {
            $impersonateId = $request->session()->get('impersonate_shop_id');
            if ($impersonateId) {
                $shop = Shop::find($impersonateId);
                if ($shop) {
                    setPermissionsTeamId($shop->id);
                    return $shop;
                }
            }
        }

        // 2. Direct tenant staff / user or shop owner
        $shop = null;
        if ($user->shop_id) {
            $shop = Shop::find($user->shop_id);
        } elseif ($user->shop) {
            $shop = $user->shop;
        }

        if (!$shop) {
            abort(403, 'No active shop found for your account.');
        }

        setPermissionsTeamId($shop->id);
        return $shop;
    }

    /**
     * Dashboard Overview
     */
    public function dashboard(Request $request): Response
    {
        $shop = $this->getShop($request);

        $metrics = [
            'total_products' => Product::where('shop_id', $shop->id)->count(),
            'published_products' => Product::where('shop_id', $shop->id)->where('status', 'published')->count(),
            'total_inquiries' => Inquiry::where('shop_id', $shop->id)->count(),
            'new_inquiries' => Inquiry::where('shop_id', $shop->id)->where('status', 'sent')->count(),
            'responded_inquiries' => Inquiry::where('shop_id', $shop->id)->where('status', 'responded')->count(),
            'low_stock_products' => Product::where('shop_id', $shop->id)->where('stock', '<=', 5)->count(),
        ];

        $recentInquiries = Inquiry::where('shop_id', $shop->id)
            ->latest()
            ->take(5)
            ->get();

        $recentProducts = Product::where('shop_id', $shop->id)
            ->with(['primaryImage', 'variants'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Manager/Dashboard', [
            'shop' => $shop,
            'metrics' => $metrics,
            'recentInquiries' => $recentInquiries,
            'recentProducts' => $recentProducts,
        ]);
    }

    /**
     * Product Management List
     */
    public function products(Request $request): Response
    {
        $shop = $this->getShop($request);

        $query = Product::where('shop_id', $shop->id)
            ->with(['primaryImage', 'variants', 'category']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Manager/Products/Index', [
            'shop' => $shop,
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Product Create Form
     */
    public function createProduct(Request $request): Response
    {
        $shop = $this->getShop($request);
        $categories = Category::where('is_active', true)->orderBy('display_order')->get();

        return Inertia::render('Manager/Products/Create', [
            'shop' => $shop,
            'categories' => $categories,
        ]);
    }

    /**
     * Store Product
     */
    public function storeProduct(Request $request)
    {
        $shop = $this->getShop($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|max:10',
            'status' => 'required|in:draft,published,hidden',
            'stock' => 'required|integer|min:0',
            'has_variants' => 'boolean',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string|max:100',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.sku' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
        ]);

        $slug = Str::slug($validated['name']);
        // Ensure unique slug within shop
        $baseSlug = $slug;
        $counter = 1;
        while (Product::where('shop_id', $shop->id)->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $product = Product::create([
            'shop_id' => $shop->id,
            'category_id' => $validated['category_id'] ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'price' => $validated['price'] ?? null,
            'sale_price' => $validated['sale_price'] ?? null,
            'currency' => $validated['currency'],
            'status' => $validated['status'],
            'stock' => $validated['stock'],
            'has_variants' => !empty($validated['has_variants']),
        ]);

        if (!empty($validated['image_url'])) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $validated['image_url'],
                'is_primary' => true,
                'display_order' => 0,
            ]);
        }

        if (!empty($validated['has_variants']) && !empty($validated['variants'])) {
            foreach ($validated['variants'] as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'name' => $v['name'],
                    'price' => $v['price'] ?? null,
                    'stock' => $v['stock'],
                    'sku' => $v['sku'] ?? null,
                ]);
            }
        }

        // Record initial inventory movement
        InventoryMovement::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'type' => 'set',
            'quantity_before' => 0,
            'quantity_change' => $product->stock,
            'quantity_after' => $product->stock,
            'reason' => 'Initial product creation',
        ]);

        return redirect()->route('manager.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Edit Product Form
     */
    public function editProduct(Request $request, int $id): Response
    {
        $shop = $this->getShop($request);
        $product = Product::where('shop_id', $shop->id)->with(['images', 'variants'])->findOrFail($id);
        $categories = Category::where('is_active', true)->orderBy('display_order')->get();

        return Inertia::render('Manager/Products/Edit', [
            'shop' => $shop,
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update Product
     */
    public function updateProduct(Request $request, int $id)
    {
        $shop = $this->getShop($request);
        $product = Product::where('shop_id', $shop->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|max:10',
            'status' => 'required|in:draft,published,hidden',
            'stock' => 'required|integer|min:0',
            'image_url' => 'nullable|string|max:500',
        ]);

        $oldStock = $product->stock;

        $product->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'price' => $validated['price'] ?? null,
            'sale_price' => $validated['sale_price'] ?? null,
            'currency' => $validated['currency'],
            'status' => $validated['status'],
            'stock' => $validated['stock'],
        ]);

        if (!empty($validated['image_url'])) {
            $existingPrimary = $product->primaryImage;
            if ($existingPrimary) {
                $existingPrimary->update(['image_path' => $validated['image_url']]);
            } else {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $validated['image_url'],
                    'is_primary' => true,
                ]);
            }
        }

        if ($oldStock !== $product->stock) {
            InventoryMovement::create([
                'shop_id' => $shop->id,
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'type' => 'set',
                'quantity_before' => $oldStock,
                'quantity_change' => $product->stock - $oldStock,
                'quantity_after' => $product->stock,
                'reason' => 'Product edit manual stock adjustment',
            ]);
        }

        return redirect()->route('manager.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Delete/Archive Product
     */
    public function destroyProduct(Request $request, int $id)
    {
        $shop = $this->getShop($request);
        $product = Product::where('shop_id', $shop->id)->findOrFail($id);

        // Soft delete so inquiry snapshots maintain foreign reference integrity
        $product->delete();

        return redirect()->route('manager.products.index')->with('success', 'Product archived.');
    }

    /**
     * Inventory Management
     */
    public function inventory(Request $request): Response
    {
        $shop = $this->getShop($request);

        $products = Product::where('shop_id', $shop->id)
            ->with(['variants'])
            ->latest()
            ->paginate(15);

        $movements = InventoryMovement::where('shop_id', $shop->id)
            ->with(['product:id,name', 'user:id,name'])
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('Manager/Inventory/Index', [
            'shop' => $shop,
            'products' => $products,
            'movements' => $movements,
        ]);
    }

    /**
     * Stock Quick Adjustment
     */
    public function adjustStock(Request $request, int $productId)
    {
        $shop = $this->getShop($request);
        $product = Product::where('shop_id', $shop->id)->findOrFail($productId);

        $validated = $request->validate([
            'adjustment_type' => 'required|in:set,add,remove',
            'quantity' => 'required|integer|min:0',
            'reason' => 'nullable|string|max:255',
        ]);

        $before = $product->stock;
        $qty = (int) $validated['quantity'];

        if ($validated['adjustment_type'] === 'set') {
            $after = $qty;
        } elseif ($validated['adjustment_type'] === 'add') {
            $after = $before + $qty;
        } else {
            $after = max(0, $before - $qty);
        }

        $change = $after - $before;
        $product->update(['stock' => $after]);

        InventoryMovement::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'type' => $validated['adjustment_type'],
            'quantity_before' => $before,
            'quantity_change' => $change,
            'quantity_after' => $after,
            'reason' => $validated['reason'] ?? 'Manual stock adjustment',
        ]);

        return back()->with('success', "Stock updated to {$after}.");
    }

    /**
     * Inquiries List
     */
    public function inquiries(Request $request): Response
    {
        $shop = $this->getShop($request);

        $query = Inquiry::where('shop_id', $shop->id)->with(['user:id,name,email']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Manager/Inquiries/Index', [
            'shop' => $shop,
            'inquiries' => $inquiries,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Inquiry Detail
     */
    public function showInquiry(Request $request, int $id): Response
    {
        $shop = $this->getShop($request);
        $inquiry = Inquiry::where('shop_id', $shop->id)->with(['histories.user'])->findOrFail($id);

        if ($inquiry->status === 'sent') {
            $inquiry->update([
                'status' => 'viewed',
                'viewed_at' => now(),
            ]);

            InquiryStatusHistory::create([
                'inquiry_id' => $inquiry->id,
                'user_id' => $request->user()->id,
                'from_status' => 'sent',
                'to_status' => 'viewed',
                'comment' => 'Viewed in shop manager dashboard',
            ]);
        }

        return Inertia::render('Manager/Inquiries/Show', [
            'shop' => $shop,
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Update Inquiry Status
     */
    public function updateInquiryStatus(Request $request, int $id)
    {
        $shop = $this->getShop($request);
        $inquiry = Inquiry::where('shop_id', $shop->id)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:viewed,responded,closed,cancelled',
            'manager_notes' => 'nullable|string|max:1000',
            'comment' => 'nullable|string|max:255',
        ]);

        $oldStatus = $inquiry->status;
        $updates = ['status' => $validated['status']];

        if (!empty($validated['manager_notes'])) {
            $updates['manager_notes'] = $validated['manager_notes'];
        }

        if ($validated['status'] === 'responded' && !$inquiry->responded_at) {
            $updates['responded_at'] = now();
        } elseif ($validated['status'] === 'closed' && !$inquiry->closed_at) {
            $updates['closed_at'] = now();
        }

        $inquiry->update($updates);

        InquiryStatusHistory::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $request->user()->id,
            'from_status' => $oldStatus,
            'to_status' => $validated['status'],
            'comment' => $validated['comment'] ?? "Status updated to {$validated['status']}",
        ]);

        return back()->with('success', 'Inquiry status updated.');
    }

    /**
     * Shop Settings Form
     */
    public function settings(Request $request): Response
    {
        $shop = $this->getShop($request);
        $categories = Category::where('is_active', true)->orderBy('display_order')->get();

        return Inertia::render('Manager/Settings/Index', [
            'shop' => $shop,
            'categories' => $categories,
        ]);
    }

    /**
     * Update Shop Settings
     */
    public function updateSettings(Request $request)
    {
        $shop = $this->getShop($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string|max:500',
            'cover_image' => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:categories,id',
            'public_phone' => 'nullable|string|max:40',
            'public_telegram_username' => 'nullable|string|max:100',
            'public_address' => 'nullable|string|max:255',
            'business_hours' => 'nullable|string|max:255',
            'contact_method_preference' => 'required|in:phone,telegram,both',
            'delivery_note' => 'nullable|string|max:500',
            'general_instructions' => 'nullable|string|max:500',
            'notifications_enabled' => 'boolean',
        ]);

        if (!empty($validated['public_telegram_username'])) {
            $validated['public_telegram_username'] = ltrim($validated['public_telegram_username'], '@');
        }

        $shop->update($validated);

        return back()->with('success', 'Shop settings saved successfully.');
    }

    /**
     * Shop User Management (Staff List & RBAC)
     */
    public function users(Request $request): Response
    {
        $shop = $this->getShop($request);
        $currentUser = $request->user();

        // Check permission unless admin
        if (!$currentUser->isAdmin() && !$currentUser->hasRole('admin')) {
            if (!$currentUser->hasPermissionTo('view shop users')) {
                abort(403, 'You do not have permission to view shop staff.');
            }
        }

        setPermissionsTeamId($shop->id);

        $users = User::where('shop_id', $shop->id)
            ->orWhere('id', $shop->user_id)
            ->with(['roles' => function ($q) use ($shop) {
                $q->where('roles.shop_id', $shop->id);
            }])
            ->latest()
            ->get()
            ->map(function ($u) use ($shop) {
                $roles = $u->roles->pluck('name')->toArray();
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'phone' => $u->phone,
                    'is_owner' => $u->id === $shop->user_id,
                    'is_active' => $u->is_active,
                    'roles' => $roles,
                    'primary_role' => $u->id === $shop->user_id ? 'shop_owner' : ($roles[0] ?? 'shop_staff'),
                    'created_at' => $u->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Manager/Users/Index', [
            'shop' => $shop,
            'users' => $users,
            'availableRoles' => [
                ['name' => 'shop_manager', 'label' => 'Shop Manager', 'description' => 'Full access to products, inventory, inquiries, and staff viewing.'],
                ['name' => 'shop_staff', 'label' => 'Shop Staff / Clerk', 'description' => 'Can manage products, view stock, and respond to customer inquiries.'],
            ],
        ]);
    }

    /**
     * Add New Staff Member to Shop
     */
    public function storeUser(Request $request)
    {
        $shop = $this->getShop($request);
        $currentUser = $request->user();

        if (!$currentUser->isAdmin() && !$currentUser->hasRole('admin')) {
            if (!$currentUser->hasPermissionTo('create shop users')) {
                abort(403, 'You do not have permission to add staff members.');
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:40',
            'password' => 'required|string|min:6',
            'role' => 'required|in:shop_manager,shop_staff',
        ]);

        $user = User::create([
            'shop_id' => $shop->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => bcrypt($validated['password']),
            'role' => 'shop_staff',
            'is_active' => true,
        ]);

        setPermissionsTeamId($shop->id);
        $user->assignRole($validated['role']);

        return back()->with('success', "Staff member {$user->name} added successfully.");
    }

    /**
     * Update Staff Member
     */
    public function updateUser(Request $request, int $id)
    {
        $shop = $this->getShop($request);
        $currentUser = $request->user();

        if (!$currentUser->isAdmin() && !$currentUser->hasRole('admin')) {
            if (!$currentUser->hasPermissionTo('edit shop users')) {
                abort(403, 'You do not have permission to modify staff members.');
            }
        }

        $user = User::where('shop_id', $shop->id)->where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:40',
            'is_active' => 'required|boolean',
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:shop_manager,shop_staff',
        ]);

        $updates = [
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'],
        ];

        if (!empty($validated['password'])) {
            $updates['password'] = bcrypt($validated['password']);
        }

        $user->update($updates);

        setPermissionsTeamId($shop->id);
        $user->syncRoles([$validated['role']]);

        return back()->with('success', "Staff member {$user->name} updated.");
    }

    /**
     * Remove Staff Member
     */
    public function destroyUser(Request $request, int $id)
    {
        $shop = $this->getShop($request);
        $currentUser = $request->user();

        if (!$currentUser->isAdmin() && !$currentUser->hasRole('admin')) {
            if (!$currentUser->hasPermissionTo('delete shop users')) {
                abort(403, 'You do not have permission to remove staff members.');
            }
        }

        if ($id === $shop->user_id) {
            return back()->with('error', 'Cannot remove the primary shop owner account.');
        }

        $user = User::where('shop_id', $shop->id)->where('id', $id)->firstOrFail();
        $user->delete();

        return back()->with('success', 'Staff member removed from shop.');
    }
}
