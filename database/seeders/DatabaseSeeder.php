<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Inquiry;
use App\Models\InquiryStatusHistory;
use App\Models\InventoryMovement;
use App\Models\MarketplaceSetting;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Platform Settings
        MarketplaceSetting::set('marketplace_name', 'Telegram Shop Marketplace');
        MarketplaceSetting::set('default_currency', 'ETB');
        MarketplaceSetting::set('allow_shop_registration', '1');
        MarketplaceSetting::set('require_shop_approval', '1');

        // 2. Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Platform Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+251911000000',
                'telegram_username' => 'marketplace_admin',
                'is_active' => true,
            ]
        );

        // 3. Shop Owners
        $owner1 = User::firstOrCreate(
            ['email' => 'jenny@sellmate.com'],
            [
                'name' => 'Jenny Wilson',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+251911223344',
                'telegram_user_id' => 12345678,
                'telegram_username' => 'jenny_sellmate',
                'is_active' => true,
            ]
        );

        $owner2 = User::firstOrCreate(
            ['email' => 'herbi@store.com'],
            [
                'name' => 'Abebe Herbal',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+251922334455',
                'telegram_username' => 'herbi_store',
                'is_active' => true,
            ]
        );

        // 4. Categories
        $categoriesData = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'Headphones'],
            ['name' => 'Beauty', 'slug' => 'beauty', 'icon' => 'Sparkles'],
            ['name' => 'Clothes', 'slug' => 'clothes', 'icon' => 'Shirt'],
            ['name' => 'Books', 'slug' => 'books', 'icon' => 'BookOpen'],
            ['name' => 'Home', 'slug' => 'home', 'icon' => 'Home'],
            ['name' => 'Sport', 'slug' => 'sport', 'icon' => 'Trophy'],
        ];

        $categories = [];
        foreach ($categoriesData as $idx => $cat) {
            $categories[$cat['slug']] = Category::firstOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                    'display_order' => $idx + 1,
                    'is_active' => true,
                ]
            );
        }

        // 5. Shops
        $shop1 = Shop::firstOrCreate(
            ['slug' => 'sellmate-gadgets'],
            [
                'user_id' => $owner1->id,
                'name' => 'SellMate Gadgets',
                'description' => 'Authentic electronics, headphones, audio gear, and personal gadgets in Addis Ababa.',
                'category_id' => $categories['electronics']->id,
                'public_phone' => '+251911223344',
                'public_telegram_username' => 'jenny_sellmate',
                'public_address' => 'Bole Medhanialem, Edna Mall 2nd Floor',
                'business_hours' => 'Mon - Sat: 9:00 AM - 7:30 PM',
                'contact_method_preference' => 'both',
                'delivery_note' => 'Same-day motorbike delivery anywhere inside Addis Ababa.',
                'general_instructions' => 'Please message or call us after sending your inquiry to confirm pickup or delivery location.',
                'status' => 'approved',
                'notifications_enabled' => true,
            ]
        );

        $shop2 = Shop::firstOrCreate(
            ['slug' => 'herbivore-botanicals'],
            [
                'user_id' => $owner2->id,
                'name' => 'Herbivore Botanicals',
                'description' => 'Natural organic facial skincare, tonics, and beauty essentials.',
                'category_id' => $categories['beauty']->id,
                'public_phone' => '+251922334455',
                'public_telegram_username' => 'herbi_store',
                'public_address' => 'Kazanchis, Bloom Tower',
                'business_hours' => 'Mon - Sat: 10:00 AM - 6:00 PM',
                'contact_method_preference' => 'both',
                'delivery_note' => 'Delivery via local courier or in-store pickup available.',
                'general_instructions' => 'Contact us on Telegram to arrange delivery time.',
                'status' => 'approved',
                'notifications_enabled' => true,
            ]
        );

        // 6. Products for SellMate (Electronics matching prompt image beats / sony / headphones)
        $beatsStudio = Product::firstOrCreate(
            ['shop_id' => $shop1->id, 'slug' => 'beats-studio-pro-headphones'],
            [
                'category_id' => $categories['electronics']->id,
                'name' => 'Beats Studio Pro Headphones',
                'description' => 'Beats Studio Pro Wireless is a premium Bluetooth overhead headphone. The gadget sounds great and effectively suppresses noise.',
                'sku' => 'BEATS-ST-PRO',
                'price' => 65.90,
                'currency' => 'USD',
                'status' => 'published',
                'stock' => 120,
                'has_variants' => true,
                'is_featured' => true,
            ]
        );

        ProductImage::firstOrCreate(
            ['product_id' => $beatsStudio->id, 'image_path' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop'],
            ['is_primary' => true, 'display_order' => 1]
        );

        $v1 = ProductVariant::firstOrCreate(
            ['product_id' => $beatsStudio->id, 'name' => 'Sandstone Cream'],
            ['price' => 65.90, 'stock' => 50, 'attributes' => ['color' => 'Sandstone Cream']]
        );
        $v2 = ProductVariant::firstOrCreate(
            ['product_id' => $beatsStudio->id, 'name' => 'Matte Black'],
            ['price' => 65.90, 'stock' => 45, 'attributes' => ['color' => 'Matte Black']]
        );
        $v3 = ProductVariant::firstOrCreate(
            ['product_id' => $beatsStudio->id, 'name' => 'Navy Blue'],
            ['price' => 65.90, 'stock' => 25, 'attributes' => ['color' => 'Navy Blue']]
        );

        $sonyHeadphones = Product::firstOrCreate(
            ['shop_id' => $shop1->id, 'slug' => 'sony-wireless-headphones-wh-1000xm4'],
            [
                'category_id' => $categories['electronics']->id,
                'name' => 'Sony Wireless WH-1000XM4',
                'description' => 'Industry-leading noise cancelling with Dual Noise Sensor technology.',
                'sku' => 'SONY-WH-4',
                'price' => 150.00,
                'currency' => 'USD',
                'status' => 'published',
                'stock' => 478,
                'has_variants' => false,
                'is_featured' => true,
            ]
        );

        ProductImage::firstOrCreate(
            ['product_id' => $sonyHeadphones->id, 'image_path' => 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop'],
            ['is_primary' => true, 'display_order' => 1]
        );

        $yotoHeadphones = Product::firstOrCreate(
            ['shop_id' => $shop1->id, 'slug' => 'yoto-wireless-headphones'],
            [
                'category_id' => $categories['electronics']->id,
                'name' => 'Yoto Wireless Headphones Orange',
                'description' => 'Durable wireless kid-friendly headphones with safe volume limiter.',
                'sku' => 'YOTO-OR-1',
                'price' => 44.99,
                'sale_price' => 56.00,
                'currency' => 'USD',
                'status' => 'published',
                'stock' => 200,
                'has_variants' => false,
            ]
        );

        ProductImage::firstOrCreate(
            ['product_id' => $yotoHeadphones->id, 'image_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop'],
            ['is_primary' => true, 'display_order' => 1]
        );

        // Herbivore Beauty Products (Rose Hibiscus Mist, Tonic, Moisturiser)
        $roseMist = Product::firstOrCreate(
            ['shop_id' => $shop2->id, 'slug' => 'rose-hibiscus-hydrating-face-mist'],
            [
                'category_id' => $categories['beauty']->id,
                'name' => 'Rose Hibiscus Hydrating Face Mist',
                'description' => 'A hydrating face mist crafted with rosewater, coconut water, and hibiscus extract.',
                'sku' => 'HERB-ROSE-MIST',
                'price' => 34.20,
                'sale_price' => 36.00,
                'currency' => 'USD',
                'status' => 'published',
                'stock' => 85,
                'has_variants' => false,
                'is_featured' => true,
            ]
        );

        ProductImage::firstOrCreate(
            ['product_id' => $roseMist->id, 'image_path' => 'https://images.unsplash.com/photo-1608248597359-bb4360e7e1f4?w=600&auto=format&fit=crop'],
            ['is_primary' => true, 'display_order' => 1]
        );

        $tonic = Product::firstOrCreate(
            ['shop_id' => $shop2->id, 'slug' => 'moisturising-facial-tonic'],
            [
                'category_id' => $categories['beauty']->id,
                'name' => 'Moisturising Gentle Facial Tonic',
                'description' => 'Restores moisture balance and leaves skin feeling fresh and supple.',
                'sku' => 'HERB-TONIC-1',
                'price' => 27.90,
                'currency' => 'USD',
                'status' => 'published',
                'stock' => 45,
                'has_variants' => false,
            ]
        );

        ProductImage::firstOrCreate(
            ['product_id' => $tonic->id, 'image_path' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop'],
            ['is_primary' => true, 'display_order' => 1]
        );

        // 7. Seed Sample Inquiries
        $inquiry1 = Inquiry::firstOrCreate(
            ['reference_number' => 'INQ-2026-B812A1'],
            [
                'shop_id' => $shop1->id,
                'user_id' => null,
                'product_id' => $beatsStudio->id,
                'product_variant_id' => $v1->id,
                'customer_name' => 'Dawit Tadesse',
                'customer_phone' => '+251911889900',
                'customer_telegram_username' => 'dawit_t',
                'preferred_contact_method' => 'telegram',
                'customer_note' => 'Is sandstone cream in stock for pickup today at Bole?',
                'product_name_snapshot' => $beatsStudio->name,
                'variant_description_snapshot' => 'Sandstone Cream',
                'product_image_snapshot' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop',
                'quantity' => 1,
                'unit_price_snapshot' => 65.90,
                'subtotal_snapshot' => 65.90,
                'currency_snapshot' => 'USD',
                'status' => 'sent',
            ]
        );

        InquiryStatusHistory::firstOrCreate(
            ['inquiry_id' => $inquiry1->id, 'to_status' => 'sent'],
            ['from_status' => 'none', 'comment' => 'Initial inquiry submitted']
        );
    }
}
