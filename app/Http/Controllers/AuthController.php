<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            if (!$user->is_active) {
                Auth::logout();
                return back()->withErrors(['email' => 'Your account has been deactivated.']);
            }

            if ($user->isAdmin()) {
                return redirect()->route('admin.overview');
            }

            if ($user->isShopOwner()) {
                return redirect()->route('manager.dashboard');
            }

            return redirect()->route('customer.home');
        }

        return back()->withErrors(['email' => 'Invalid email or password.']);
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:customer,shop_owner',
            'phone' => 'nullable|string|max:40',
            'shop_name' => 'required_if:role,shop_owner|nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        if ($user->isShopOwner() && !empty($validated['shop_name'])) {
            $slug = Str::slug($validated['shop_name']);
            $baseSlug = $slug;
            $counter = 1;
            while (Shop::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            Shop::create([
                'user_id' => $user->id,
                'name' => $validated['shop_name'],
                'slug' => $slug,
                'status' => 'approved', // Auto-approved for easy merchant onboarding in local/demo
                'public_phone' => $validated['phone'] ?? null,
            ]);
        }

        Auth::login($user);

        if ($user->isShopOwner()) {
            return redirect()->route('manager.dashboard');
        }

        return redirect()->route('customer.home');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
