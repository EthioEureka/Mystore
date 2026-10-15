<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define Granular Permissions
        $permissions = [
            // Product management
            'view products',
            'create products',
            'edit products',
            'delete products',

            // Inventory
            'view inventory',
            'adjust inventory',

            // Inquiries
            'view inquiries',
            'update inquiries',

            // Shop settings
            'view shop settings',
            'manage shop settings',

            // Shop User Management (Staff RBAC)
            'view shop users',
            'create shop users',
            'edit shop users',
            'delete shop users',

            // Platform Admin Permissions
            'access admin dashboard',
            'manage shops',
            'manage categories',
            'manage platform users',
            'manage platform settings',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // 2. Global Role Templates (shop_id = null)
        setPermissionsTeamId(null);

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // Shop Owner Role Template
        $ownerRole = Role::firstOrCreate(['name' => 'shop_owner', 'guard_name' => 'web']);
        $ownerRole->syncPermissions([
            'view products', 'create products', 'edit products', 'delete products',
            'view inventory', 'adjust inventory',
            'view inquiries', 'update inquiries',
            'view shop settings', 'manage shop settings',
            'view shop users', 'create shop users', 'edit shop users', 'delete shop users',
        ]);

        // Shop Manager Role Template
        $managerRole = Role::firstOrCreate(['name' => 'shop_manager', 'guard_name' => 'web']);
        $managerRole->syncPermissions([
            'view products', 'create products', 'edit products',
            'view inventory', 'adjust inventory',
            'view inquiries', 'update inquiries',
            'view shop settings',
            'view shop users',
        ]);

        // Shop Staff Role Template
        $staffRole = Role::firstOrCreate(['name' => 'shop_staff', 'guard_name' => 'web']);
        $staffRole->syncPermissions([
            'view products', 'create products', 'edit products',
            'view inventory',
            'view inquiries',
        ]);

        // Assign global admin role to admin user if exists
        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($adminRole);
        }

        // 3. Shop-scoped Tenant Assignments
        $shops = Shop::all();
        foreach ($shops as $shop) {
            if ($shop->owner) {
                $shop->owner->update(['shop_id' => $shop->id]);
                setPermissionsTeamId($shop->id);
                $shop->owner->assignRole($ownerRole);
            }
        }

        // Reset team id back to null
        setPermissionsTeamId(null);
    }
}
