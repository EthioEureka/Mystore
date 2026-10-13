<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MarketplaceInquiryFlowTest extends TestCase
{
    use DatabaseTransactions;

    protected User $owner;
    protected Shop $shop;
    protected Product $product;
    protected ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::create([
            'name' => 'Test Owner',
            'email' => 'owner_' . uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'role' => 'shop_owner',
            'phone' => '+251911223344',
            'is_active' => true,
        ]);

        $this->shop = Shop::create([
            'user_id' => $this->owner->id,
            'name' => 'Audio Express',
            'slug' => 'audio-express-' . uniqid(),
            'status' => 'approved',
            'public_phone' => '+251911223344',
            'public_telegram_username' => 'audio_express_tg',
        ]);

        $this->product = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'Beats Studio Wireless',
            'slug' => 'beats-studio-wireless',
            'price' => 65.90,
            'currency' => 'USD',
            'stock' => 50,
            'status' => 'published',
            'has_variants' => true,
        ]);

        $this->variant = ProductVariant::create([
            'product_id' => $this->product->id,
            'name' => 'Sandstone Cream',
            'price' => 65.90,
            'stock' => 20,
        ]);
    }

    public function test_customer_can_view_marketplace_home()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_customer_can_search_products()
    {
        $response = $this->get('/search?q=Beats');
        $response->assertStatus(200);
    }

    public function test_customer_can_submit_purchase_inquiry_with_snapshot()
    {
        $response = $this->post("/shops/{$this->shop->slug}/products/{$this->product->slug}/inquire", [
            'customer_name' => 'Kebede Alemu',
            'customer_phone' => '+251911998877',
            'customer_telegram_username' => '@kebede_a',
            'quantity' => 2,
            'product_variant_id' => $this->variant->id,
            'preferred_contact_method' => 'telegram',
            'customer_note' => 'Please message me on Telegram when ready.',
            'acknowledges_offline_sale' => '1',
        ]);

        $response->assertRedirect();

        // Verify inquiry created in database with immutable snapshot
        $inquiry = Inquiry::where('customer_name', 'Kebede Alemu')->first();
        $this->assertNotNull($inquiry);
        $this->assertEquals('Audio Express', $inquiry->shop->name);
        $this->assertEquals('Beats Studio Wireless', $inquiry->product_name_snapshot);
        $this->assertEquals('Sandstone Cream', $inquiry->variant_description_snapshot);
        $this->assertEquals(2, $inquiry->quantity);
        $this->assertEquals(65.90, $inquiry->unit_price_snapshot);
        $this->assertEquals(131.80, $inquiry->subtotal_snapshot);
        $this->assertEquals('sent', $inquiry->status);

        // Product stock is NOT deducted on mere inquiry (strictly inquiry discovery rule)
        $this->product->refresh();
        $this->assertEquals(50, $this->product->stock);
    }

    public function test_suspended_shop_cannot_receive_inquiries()
    {
        $this->shop->update(['status' => 'suspended']);

        $response = $this->post("/shops/{$this->shop->slug}/products/{$this->product->slug}/inquire", [
            'customer_name' => 'Kebede Alemu',
            'customer_phone' => '+251911998877',
            'quantity' => 1,
            'preferred_contact_method' => 'phone',
            'acknowledges_offline_sale' => '1',
        ]);

        $response->assertStatus(404);
    }

    public function test_shop_manager_can_update_inquiry_status()
    {
        $inquiry = Inquiry::create([
            'reference_number' => Inquiry::generateReference(),
            'shop_id' => $this->shop->id,
            'customer_name' => 'Almaz',
            'customer_phone' => '+251922001122',
            'preferred_contact_method' => 'phone',
            'product_name_snapshot' => $this->product->name,
            'quantity' => 1,
            'status' => 'sent',
        ]);

        $response = $this->actingAs($this->owner)
            ->put("/manager/inquiries/{$inquiry->id}/status", [
                'status' => 'responded',
                'comment' => 'Called customer and confirmed delivery',
            ]);

        $response->assertRedirect();
        $inquiry->refresh();
        $this->assertEquals('responded', $inquiry->status);
        $this->assertNotNull($inquiry->responded_at);
    }
}
