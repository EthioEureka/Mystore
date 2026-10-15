<?php

namespace App\Http\Middleware;

use App\Models\Shop;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request with multi-tenant context and RBAC.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->is_active) {
            auth()->logout();
            return redirect()->route('login')->withErrors(['email' => 'Your account has been deactivated.']);
        }

        // 1. If Admin, always grant access and support shop impersonation
        if ($user->isAdmin() || $user->hasRole('admin')) {
            // Check if admin is accessing/impersonating a specific shop
            if ($impersonateShopId = $request->session()->get('impersonate_shop_id')) {
                setPermissionsTeamId($impersonateShopId);
            }
            return $next($request);
        }

        // 2. Ensure User matches requested role (or has shop staff / owner role)
        $hasAccess = in_array($user->role, $roles);

        // If 'shop_owner' was requested, also allow 'shop_staff' / tenant users
        if (!$hasAccess && in_array('shop_owner', $roles)) {
            $hasAccess = $user->isStaff() || $user->shop_id !== null;
        }

        if (!$hasAccess) {
            abort(403, 'Unauthorized access.');
        }

        // 3. Establish Multi-Tenant Shop Context for the User
        $shop = null;
        if ($user->shop_id) {
            $shop = Shop::find($user->shop_id);
        } elseif ($user->shop) {
            $shop = $user->shop;
        }

        if (!$shop) {
            abort(403, 'You do not belong to any active shop tenant.');
        }

        if ($shop->status === 'suspended') {
            abort(403, 'Your shop account is currently suspended. Please contact the platform administrator.');
        }

        // Set Spatie Permissions team context to this shop
        setPermissionsTeamId($shop->id);
        $request->merge(['current_shop' => $shop]);
        session(['current_shop_id' => $shop->id]);

        return $next($request);
    }
}
