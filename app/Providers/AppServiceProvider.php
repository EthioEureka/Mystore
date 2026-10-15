<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Platform Admins have super-access to all abilities across the platform
        Gate::before(function ($user, $ability) {
            return ($user && $user->isAdmin()) ? true : null;
        });
    }
}
