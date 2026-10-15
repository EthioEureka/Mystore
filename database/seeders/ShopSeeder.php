<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner1 = User::where('email', 'jenny@sellmate.com')->first();
        $owner2 = User::where('email', 'herbi@store.com')->first();
        $electronicsCategory = Category::where('slug', 'electronics')->first();
        $beautyCategory = Category::where('slug', 'beauty')->first();

        if ($owner1 && $electronicsCategory) {
            Shop::firstOrCreate(
                ['slug' => 'sellmate-gadgets'],
                [
                    'user_id' => $owner1->id,
                    'name' => 'SellMate Gadgets',
                    'description' => 'Authentic electronics, headphones, audio gear, and personal gadgets in Addis Ababa.',
                    'category_id' => $electronicsCategory->id,
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
        }

        if ($owner2 && $beautyCategory) {
            Shop::firstOrCreate(
                ['slug' => 'herbivore-botanicals'],
                [
                    'user_id' => $owner2->id,
                    'name' => 'Herbivore Botanicals',
                    'description' => 'Natural organic facial skincare, tonics, and beauty essentials.',
                    'category_id' => $beautyCategory->id,
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
        }
    }
}

