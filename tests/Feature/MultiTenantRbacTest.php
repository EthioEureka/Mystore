<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Shop;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenantRbacTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_public_self_registration_route_is_removed(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(404);
    }

    public function test_admin_can_register_new_shop_tenant(): void
    {
        $admin = User::factory()->create([
            'email' => 'superadmin@example.com',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $category = Category::create([
            'name' => 'Fashion',
            'slug' => 'fashion',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Bole Fashion Store',
            'category_id' => $category->id,
            'description' => 'Premium boutique in Bole',
            'public_phone' => '+251911998877',
            'public_telegram_username' => 'bole_fashion',
            'owner_name' => 'Bole Owner',
            'owner_email' => 'owner@bolefashion.com',
            'owner_password' => 'secret123',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('shops', ['name' => 'Bole Fashion Store', 'status' => 'approved']);
        $this->assertDatabaseHas('users', ['email' => 'owner@bolefashion.com', 'role' => 'shop_owner']);

        $shop = Shop::where('name', 'Bole Fashion Store')->first();
        $owner = User::where('email', 'owner@bolefashion.com')->first();
        $this->assertEquals($shop->id, $owner->shop_id);
    }

    public function test_admin_can_impersonate_any_shop_dashboard(): void
    {
        $admin = User::factory()->create([
            'email' => 'superadmin2@example.com',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $owner = User::factory()->create(['role' => 'shop_owner', 'is_active' => true]);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Test Tenant Shop',
            'slug' => 'test-tenant-shop',
            'status' => 'approved',
        ]);
        $owner->update(['shop_id' => $shop->id]);

        $response = $this->actingAs($admin)->post("/admin/shops/{$shop->id}/impersonate");
        $response->assertRedirect(route('manager.dashboard'));
        $response->assertSessionHas('impersonate_shop_id', $shop->id);

        // Access manager dashboard with impersonation
        $dashResponse = $this->actingAs($admin)->get('/manager');
        $dashResponse->assertStatus(200);

        // Leave impersonation
        $leaveResponse = $this->actingAs($admin)->post('/admin/shops/leave-impersonation');
        $leaveResponse->assertRedirect(route('admin.shops.index'));
        $this->assertNull(session('impersonate_shop_id'));
    }

    public function test_shop_owner_can_manage_shop_staff_with_rbac(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner', 'is_active' => true]);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Gadget Hub',
            'slug' => 'gadget-hub',
            'status' => 'approved',
        ]);
        $owner->update(['shop_id' => $shop->id]);

        setPermissionsTeamId($shop->id);
        $ownerRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'shop_owner', 'guard_name' => 'web']);
        $ownerRole->givePermissionTo(['view shop users', 'create shop users', 'edit shop users', 'delete shop users']);
        $owner->assignRole($ownerRole);

        // View staff list
        $viewResponse = $this->actingAs($owner)->get('/manager/users');
        $viewResponse->assertStatus(200);

        // Add a new staff member to this shop
        $addResponse = $this->actingAs($owner)->post('/manager/users', [
            'name' => 'Abebe Staff',
            'email' => 'abebe@gadgethub.com',
            'phone' => '+251911445566',
            'password' => 'password123',
            'role' => 'shop_staff',
        ]);

        $addResponse->assertSessionHas('success');
        $this->assertDatabaseHas('users', [
            'email' => 'abebe@gadgethub.com',
            'shop_id' => $shop->id,
            'role' => 'shop_staff',
        ]);
    }
}
