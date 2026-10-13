<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerMarketplaceController extends Controller
{
    /**
     * Screen 1: Marketplace Home
     */
    public function home(Request $request): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('display_order')
            ->take(8)
            ->get();

        $featuredShops = Shop::where('status', 'approved')
            ->withCount(['products' => fn ($q) => $q->where('status', 'published')])
            ->take(6)
            ->get();

        $products = Product::where('status', 'published')
            ->whereHas('shop', fn ($q) => $q->where('status', 'approved'))
            ->with(['shop:id,name,slug,logo', 'primaryImage', 'variants'])
            ->latest()
            ->take(12)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => $p->price,
                'sale_price' => $p->sale_price,
                'currency' => $p->currency,
                'shop' => $p->shop,
                'primary_image' => $p->primaryImage?->image_path,
                'availability' => $p->availability_status,
                'stock' => $p->total_stock,
            ]);

        return Inertia::render('Customer/Home', [
            'categories' => $categories,
            'featuredShops' => $featuredShops,
            'products' => $products,
        ]);
    }

    /**
     * Screen 2: Search & Filter Products
     */
    public function search(Request $request): Response
    {
        $query = Product::where('status', 'published')
            ->whereHas('shop', fn ($q) => $q->where('status', 'approved'))
            ->with(['shop:id,name,slug,logo', 'primaryImage', 'category:id,name']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('shop', fn ($sq) => $sq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($shopSlug = $request->input('shop')) {
            $query->whereHas('shop', fn ($q) => $q->where('slug', $shopSlug));
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($availability = $request->input('availability')) {
            if ($availability === 'in_stock') {
                $query->where('stock', '>', 0);
            }
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        if ($sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('display_order')->get();

        return Inertia::render('Customer/Search', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['q', 'category', 'shop', 'min_price', 'max_price', 'availability', 'sort']),
        ]);
    }

    /**
     * Categories Directory
     */
    public function categories(): Response
    {
        $categories = Category::where('is_active', true)
            ->withCount(['products' => fn ($q) => $q->where('status', 'published')])
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Customer/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Screen 3: Public Shop Storefront
     */
    public function shop(string $slug): Response
    {
        $shop = Shop::where('slug', $slug)
            ->where('status', 'approved')
            ->with(['category'])
            ->firstOrFail();

        $products = Product::where('shop_id', $shop->id)
            ->where('status', 'published')
            ->with(['primaryImage', 'variants'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/ShopDetail', [
            'shop' => $shop,
            'products' => $products,
        ]);
    }

    /**
     * Screen 4: Product Detail
     */
    public function product(string $shopSlug, string $productSlug): Response
    {
        $shop = Shop::where('slug', $shopSlug)
            ->where('status', 'approved')
            ->firstOrFail();

        $product = Product::where('shop_id', $shop->id)
            ->where('slug', $productSlug)
            ->where('status', 'published')
            ->with(['shop', 'category', 'images', 'variants'])
            ->firstOrFail();

        $relatedProducts = Product::where('shop_id', $shop->id)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->with(['primaryImage'])
            ->take(4)
            ->get();

        return Inertia::render('Customer/ProductDetail', [
            'shop' => $shop,
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Toggle Favorite
     */
    public function toggleFavorite(Request $request, int $productId)
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $existing = Favorite::where('product_id', $productId)
            ->where(function ($q) use ($user, $sessionId) {
                if ($user) {
                    $q->where('user_id', $user->id);
                } else {
                    $q->where('session_id', $sessionId);
                }
            })
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from saved items');
        }

        Favorite::create([
            'user_id' => $user?->id,
            'session_id' => $user ? null : $sessionId,
            'product_id' => $productId,
        ]);

        return back()->with('success', 'Item saved');
    }

    /**
     * Screen 8: Saved items
     */
    public function saved(Request $request): Response
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $favorites = Favorite::where(function ($q) use ($user, $sessionId) {
                if ($user) {
                    $q->where('user_id', $user->id);
                } else {
                    $q->where('session_id', $sessionId);
                }
            })
            ->with(['product.shop', 'product.primaryImage'])
            ->latest()
            ->get();

        return Inertia::render('Customer/Saved', [
            'favorites' => $favorites,
        ]);
    }
}
