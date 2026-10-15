<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerInquiryController;
use App\Http\Controllers\CustomerMarketplaceController;
use App\Http\Controllers\ShopManagerController;
use App\Http\Controllers\TelegramIntegrationController;
use App\Http\Middleware\EnsureRole;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Telegram Shop Marketplace
|--------------------------------------------------------------------------
*/

// --- Public Customer Marketplace (Telegram Mini App & Mobile Web) ---
Route::get('/', [CustomerMarketplaceController::class, 'home'])->name('customer.home');
Route::get('/search', [CustomerMarketplaceController::class, 'search'])->name('customer.search');
Route::get('/categories', [CustomerMarketplaceController::class, 'categories'])->name('customer.categories');
Route::get('/shops/{slug}', [CustomerMarketplaceController::class, 'shop'])->name('customer.shop');
Route::get('/shops/{shopSlug}/products/{productSlug}', [CustomerMarketplaceController::class, 'product'])->name('customer.product');
Route::post('/products/{productId}/favorite', [CustomerMarketplaceController::class, 'toggleFavorite'])->name('customer.favorite.toggle');
Route::get('/saved', [CustomerMarketplaceController::class, 'saved'])->name('customer.saved');

// --- Purchase Inquiry Checkout & Confirmation (NO ONLINE PAYMENTS) ---
Route::get('/shops/{shopSlug}/products/{productSlug}/inquire', [CustomerInquiryController::class, 'checkout'])->name('customer.inquiry.checkout');
Route::post('/shops/{shopSlug}/products/{productSlug}/inquire', [CustomerInquiryController::class, 'submit'])->name('customer.inquiry.submit');
Route::get('/inquiries/confirmation/{referenceNumber}', [CustomerInquiryController::class, 'confirmation'])->name('customer.inquiry.confirmation');
Route::get('/inquiries/history', [CustomerInquiryController::class, 'myInquiries'])->name('customer.inquiry.history');
Route::post('/inquiries/{referenceNumber}/cancel', [CustomerInquiryController::class, 'cancel'])->name('customer.inquiry.cancel');

// --- Telegram Mini App Integration Endpoints ---
Route::post('/api/telegram/auth', [TelegramIntegrationController::class, 'authenticate'])->name('telegram.auth');
Route::post('/telegram/webhook', [TelegramIntegrationController::class, 'webhook'])->name('telegram.webhook');

// --- Authentication (Breeze Standard Secure Login / Logout - No Public Self-Registration) ---
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// --- Shop Manager Dashboard (Multi-Tenant Shop Owner & Staff RBAC) ---
Route::middleware(['auth', EnsureRole::class.':shop_owner,admin'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('/', [ShopManagerController::class, 'dashboard'])->name('dashboard');
    
    // Products
    Route::get('/products', [ShopManagerController::class, 'products'])->name('products.index');
    Route::get('/products/create', [ShopManagerController::class, 'createProduct'])->name('products.create');
    Route::post('/products', [ShopManagerController::class, 'storeProduct'])->name('products.store');
    Route::get('/products/{id}/edit', [ShopManagerController::class, 'editProduct'])->name('products.edit');
    Route::put('/products/{id}', [ShopManagerController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{id}', [ShopManagerController::class, 'destroyProduct'])->name('products.destroy');

    // Inventory & Stock
    Route::get('/inventory', [ShopManagerController::class, 'inventory'])->name('inventory.index');
    Route::post('/products/{productId}/stock', [ShopManagerController::class, 'adjustStock'])->name('inventory.adjust');

    // Inquiries
    Route::get('/inquiries', [ShopManagerController::class, 'inquiries'])->name('inquiries.index');
    Route::get('/inquiries/{id}', [ShopManagerController::class, 'showInquiry'])->name('inquiries.show');
    Route::put('/inquiries/{id}/status', [ShopManagerController::class, 'updateInquiryStatus'])->name('inquiries.status');

    // Shop User Management (Staff RBAC)
    Route::get('/users', [ShopManagerController::class, 'users'])->name('users.index');
    Route::post('/users', [ShopManagerController::class, 'storeUser'])->name('users.store');
    Route::put('/users/{id}', [ShopManagerController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{id}', [ShopManagerController::class, 'destroyUser'])->name('users.destroy');

    // Settings
    Route::get('/settings', [ShopManagerController::class, 'settings'])->name('settings.index');
    Route::put('/settings', [ShopManagerController::class, 'updateSettings'])->name('settings.update');
});

// --- Platform Admin Dashboard ---
Route::middleware(['auth', EnsureRole::class.':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'overview'])->name('overview');
    
    // Shops moderation & Admin Shop Creation
    Route::get('/shops', [AdminDashboardController::class, 'shops'])->name('shops.index');
    Route::post('/shops', [AdminDashboardController::class, 'storeShop'])->name('shops.store');
    Route::post('/shops/{id}/impersonate', [AdminDashboardController::class, 'impersonateShop'])->name('shops.impersonate');
    Route::post('/shops/leave-impersonation', [AdminDashboardController::class, 'leaveImpersonation'])->name('shops.leave-impersonation');
    Route::put('/shops/{id}/status', [AdminDashboardController::class, 'updateShopStatus'])->name('shops.status');

    // Categories
    Route::get('/categories', [AdminDashboardController::class, 'categories'])->name('categories.index');
    Route::post('/categories', [AdminDashboardController::class, 'storeCategory'])->name('categories.store');

    // Platform Users
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
    Route::post('/users/{id}/toggle-status', [AdminDashboardController::class, 'toggleUserStatus'])->name('users.toggle');

    // Settings
    Route::get('/settings', [AdminDashboardController::class, 'settings'])->name('settings.index');
    Route::post('/settings', [AdminDashboardController::class, 'saveSettings'])->name('settings.save');
});
