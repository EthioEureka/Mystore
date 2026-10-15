<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\MarketplaceSetting;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Admin Overview
     */
    public function overview(): Response
    {
        $metrics = [
            'total_users' => User::count(),
            'total_shops' => Shop::count(),
            'pending_shops' => Shop::where('status', 'pending')->count(),
            'approved_shops' => Shop::where('status', 'approved')->count(),
            'suspended_shops' => Shop::where('status', 'suspended')->count(),
            'total_products' => Product::count(),
            'published_products' => Product::where('status', 'published')->count(),
            'total_inquiries' => Inquiry::count(),
            'closed_inquiries' => Inquiry::where('status', 'closed')->count(),
        ];

        $pendingShops = Shop::where('status', 'pending')
            ->with(['owner:id,name,email,phone'])
            ->latest()
            ->take(5)
            ->get();

        $recentInquiries = Inquiry::with(['shop:id,name'])
            ->latest()
            ->take(5)
            ->get();

        $recentAuditLogs = AuditLog::with(['user:id,name'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Overview', [
            'metrics' => $metrics,
            'pendingShops' => $pendingShops,
            'recentInquiries' => $recentInquiries,
            'recentAuditLogs' => $recentAuditLogs,
        ]);
    }

    /**
     * Shops Administration
     */
    public function shops(Request $request): Response
    {
        $query = Shop::with(['owner:id,name,email', 'category:id,name'])
            ->withCount(['products', 'inquiries']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $shops = $query->latest()->paginate(15)->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Admin Registers a New Shop & Assigns Owner (multi-tenant tenant creation)
     */
    public function storeShop(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'public_phone' => 'nullable|string|max:40',
            'public_telegram_username' => 'nullable|string|max:100',
            'public_address' => 'nullable|string|max:255',
            'business_hours' => 'nullable|string|max:255',
            'delivery_note' => 'nullable|string|max:500',

            // Owner Details
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|max:255|unique:users,email',
            'owner_password' => 'required|string|min:6',
            'owner_phone' => 'nullable|string|max:40',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Shop::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        // 1. Create the Owner User
        $owner = User::create([
            'name' => $validated['owner_name'],
            'email' => $validated['owner_email'],
            'password' => bcrypt($validated['owner_password']),
            'role' => 'shop_owner',
            'phone' => $validated['owner_phone'] ?? $validated['public_phone'] ?? null,
            'telegram_username' => $validated['public_telegram_username'] ?? null,
            'is_active' => true,
        ]);

        // 2. Create the Shop
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'category_id' => $validated['category_id'],
            'description' => $validated['description'] ?? null,
            'public_phone' => $validated['public_phone'] ?? null,
            'public_telegram_username' => $validated['public_telegram_username'] ?? null,
            'public_address' => $validated['public_address'] ?? null,
            'business_hours' => $validated['business_hours'] ?? null,
            'delivery_note' => $validated['delivery_note'] ?? null,
            'status' => 'approved', // Admin registered -> immediately active
            'notifications_enabled' => true,
        ]);

        // Link owner's tenant shop_id
        $owner->update(['shop_id' => $shop->id]);

        // 3. Setup Spatie Roles for this Shop Tenant
        $ownerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'shop_owner', 'guard_name' => 'web']);
        setPermissionsTeamId($shop->id);
        $owner->assignRole($ownerRole);
        setPermissionsTeamId(null);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_created_shop',
            'target_type' => 'Shop',
            'target_id' => $shop->id,
            'details' => ['name' => $shop->name, 'owner' => $owner->email],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Shop '{$shop->name}' and owner account created successfully.");
    }

    /**
     * Admin Impersonates/Accesses a Shop's Dashboard directly
     */
    public function impersonateShop(Request $request, int $id)
    {
        $shop = Shop::findOrFail($id);

        $request->session()->put('impersonate_shop_id', $shop->id);
        setPermissionsTeamId($shop->id);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_impersonate_shop',
            'target_type' => 'Shop',
            'target_id' => $shop->id,
            'details' => ['shop' => $shop->name],
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('manager.dashboard')->with('info', "Now managing {$shop->name} as platform administrator.");
    }

    /**
     * Admin Exits Shop Impersonation & Returns to Admin Panel
     */
    public function leaveImpersonation(Request $request)
    {
        $request->session()->forget('impersonate_shop_id');
        setPermissionsTeamId(null);

        return redirect()->route('admin.shops.index')->with('info', 'Returned to Admin Dashboard.');
    }

    /**
     * Moderate Shop (Approve, Suspend, Reject)
     */
    public function updateShopStatus(Request $request, int $id)
    {
        $shop = Shop::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:approved,suspended,rejected,pending',
            'reason' => 'nullable|string|max:500',
        ]);

        $oldStatus = $shop->status;
        $updates = ['status' => $validated['status']];

        if ($validated['status'] === 'rejected') {
            $updates['rejection_reason'] = $validated['reason'] ?? null;
        } elseif ($validated['status'] === 'suspended') {
            $updates['suspension_reason'] = $validated['reason'] ?? null;
        }

        $shop->update($updates);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "shop_status_{$validated['status']}",
            'target_type' => 'Shop',
            'target_id' => $shop->id,
            'details' => [
                'from_status' => $oldStatus,
                'to_status' => $validated['status'],
                'reason' => $validated['reason'] ?? null,
            ],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Shop status changed to {$validated['status']}.");
    }

    /**
     * Categories Administration
     */
    public function categories(): Response
    {
        $categories = Category::withCount(['products', 'shops'])
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store Category
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:categories,slug',
            'icon' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:255',
            'display_order' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        Category::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    /**
     * Users Administration
     */
    public function users(Request $request): Response
    {
        $query = User::withCount(['shops', 'inquiries']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Moderate User (Toggle active status)
     */
    public function toggleUserStatus(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot disable your own admin account.');
        }

        $user->update(['is_active' => !$user->is_active]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $user->is_active ? 'user_reactivated' : 'user_suspended',
            'target_type' => 'User',
            'target_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'User status updated.');
    }

    /**
     * Platform Settings
     */
    public function settings(): Response
    {
        $settings = MarketplaceSetting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'telegram_configured' => !empty(env('TELEGRAM_BOT_TOKEN')),
            'telegram_bot_username' => env('TELEGRAM_BOT_USERNAME', 'telegram_shop_bot'),
        ]);
    }

    /**
     * Save Platform Settings
     */
    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'marketplace_name' => 'required|string|max:100',
            'default_currency' => 'required|string|max:10',
            'allow_shop_registration' => 'required|boolean',
            'require_shop_approval' => 'required|boolean',
        ]);

        foreach ($validated as $key => $val) {
            MarketplaceSetting::set($key, (string) $val);
        }

        return back()->with('success', 'Marketplace settings saved.');
    }
}
