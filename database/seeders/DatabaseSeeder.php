<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MarketplaceSettingSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ShopSeeder::class,
            ProductSeeder::class,
            InquirySeeder::class,
        ]);
    }
}
