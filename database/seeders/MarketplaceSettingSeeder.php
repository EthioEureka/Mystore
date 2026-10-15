<?php

namespace Database\Seeders;

use App\Models\MarketplaceSetting;
use Illuminate\Database\Seeder;

class MarketplaceSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MarketplaceSetting::set('marketplace_name', 'Telegram Shop Marketplace');
        MarketplaceSetting::set('default_currency', 'ETB');
        MarketplaceSetting::set('allow_shop_registration', '1');
        MarketplaceSetting::set('require_shop_approval', '1');
    }
}

