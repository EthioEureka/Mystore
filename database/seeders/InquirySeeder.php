<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use App\Models\InquiryStatusHistory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shop;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shop1 = Shop::where('slug', 'sellmate-gadgets')->first();
        $beatsStudio = Product::where('slug', 'beats-studio-pro-headphones')->first();
        $variant = ProductVariant::where('name', 'Sandstone Cream')->first();

        if ($shop1 && $beatsStudio && $variant) {
            $inquiry1 = Inquiry::firstOrCreate(
                ['reference_number' => 'INQ-2026-B812A1'],
                [
                    'shop_id' => $shop1->id,
                    'user_id' => null,
                    'product_id' => $beatsStudio->id,
                    'product_variant_id' => $variant->id,
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
}

