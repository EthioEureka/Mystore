<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Shop;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shop1 = Shop::where('slug', 'sellmate-gadgets')->first();
        $shop2 = Shop::where('slug', 'herbivore-botanicals')->first();
        $electronicsCategory = Category::where('slug', 'electronics')->first();
        $beautyCategory = Category::where('slug', 'beauty')->first();

        // 1. Products for SellMate Gadgets (Electronics)
        if ($shop1 && $electronicsCategory) {
            // Beats Studio Pro
            $beatsStudio = Product::firstOrCreate(
                ['shop_id' => $shop1->id, 'slug' => 'beats-studio-pro-headphones'],
                [
                    'category_id' => $electronicsCategory->id,
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

            ProductVariant::firstOrCreate(
                ['product_id' => $beatsStudio->id, 'name' => 'Sandstone Cream'],
                ['price' => 65.90, 'stock' => 50, 'attributes' => ['color' => 'Sandstone Cream']]
            );
            ProductVariant::firstOrCreate(
                ['product_id' => $beatsStudio->id, 'name' => 'Matte Black'],
                ['price' => 65.90, 'stock' => 45, 'attributes' => ['color' => 'Matte Black']]
            );
            ProductVariant::firstOrCreate(
                ['product_id' => $beatsStudio->id, 'name' => 'Navy Blue'],
                ['price' => 65.90, 'stock' => 25, 'attributes' => ['color' => 'Navy Blue']]
            );

            // Sony WH-1000XM4
            $sonyHeadphones = Product::firstOrCreate(
                ['shop_id' => $shop1->id, 'slug' => 'sony-wireless-headphones-wh-1000xm4'],
                [
                    'category_id' => $electronicsCategory->id,
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

            // Yoto Wireless Headphones
            $yotoHeadphones = Product::firstOrCreate(
                ['shop_id' => $shop1->id, 'slug' => 'yoto-wireless-headphones'],
                [
                    'category_id' => $electronicsCategory->id,
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
        }

        // 2. Products for Herbivore Botanicals (Beauty)
        if ($shop2 && $beautyCategory) {
            // Rose Hibiscus Hydrating Face Mist
            $roseMist = Product::firstOrCreate(
                ['shop_id' => $shop2->id, 'slug' => 'rose-hibiscus-hydrating-face-mist'],
                [
                    'category_id' => $beautyCategory->id,
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

            // Moisturising Gentle Facial Tonic
            $tonic = Product::firstOrCreate(
                ['shop_id' => $shop2->id, 'slug' => 'moisturising-facial-tonic'],
                [
                    'category_id' => $beautyCategory->id,
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
        }
    }
}

