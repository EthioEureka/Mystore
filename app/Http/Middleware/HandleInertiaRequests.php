<?php

namespace App\Http\Middleware;

use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $shop = null;
        $isImpersonating = false;

        if ($user) {
            // Check if admin is impersonating/managing a specific shop
            $impersonateId = $request->session()->get('impersonate_shop_id');
            if ($user->isAdmin() && $impersonateId) {
                $shop = Shop::find($impersonateId);
                $isImpersonating = true;
            } elseif ($user->shop_id) {
                $shop = Shop::find($user->shop_id);
            } elseif ($user->shop) {
                $shop = $user->shop;
            }
        }

        // Gather user permissions for the current shop context
        $permissions = [];
        if ($user) {
            if ($user->isAdmin()) {
                $permissions = ['*']; // Super-admin wildcard
            } elseif ($shop) {
                setPermissionsTeamId($shop->id);
                $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'telegram_username' => $user->telegram_username,
                    'telegram_user_id' => $user->telegram_user_id,
                    'permissions' => $permissions,
                    'is_impersonating' => $isImpersonating,
                ] : null,
                'shop' => $shop ? [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'slug' => $shop->slug,
                    'status' => $shop->status,
                    'logo' => $shop->logo,
                    'category_id' => $shop->category_id,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'telegram' => [
                'bot_username' => env('TELEGRAM_BOT_USERNAME', 'telegram_shop_bot'),
            ],
        ];
    }
}
