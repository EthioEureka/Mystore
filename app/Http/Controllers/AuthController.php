<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Display the customizable login view.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
            'canResetPassword' => false,
        ]);
    }

    /**
     * Handle an incoming authentication request using Breeze LoginRequest (with rate limiting).
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors(['email' => 'This account has been deactivated. Please contact support.']);
        }

        // Set permissions team context if user belongs to a shop
        if ($user->shop_id) {
            setPermissionsTeamId($user->shop_id);
            session(['current_shop_id' => $user->shop_id]);
        } elseif ($user->shop) {
            setPermissionsTeamId($user->shop->id);
            session(['current_shop_id' => $user->shop->id]);
        }

        if ($user->isAdmin() || $user->hasRole('admin')) {
            return redirect()->intended(route('admin.overview'));
        }

        if ($user->isShopOwner() || $user->isStaff() || $user->shop_id || $user->shop) {
            return redirect()->intended(route('manager.dashboard'));
        }

        return redirect()->intended(route('customer.home'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
