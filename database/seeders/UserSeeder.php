<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Platform Administrator
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Platform Administrator',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'phone' => '+251911000000',
                'telegram_username' => 'marketplace_admin',
                'is_active' => true,
            ]
        );

        // Shop Owner 1: SellMate Gadgets
        User::firstOrCreate(
            ['email' => 'owner@gmail.com'],
            [
                'name' => 'Jenny Wilson',
                'password' => Hash::make('12345678'),
                'role' => 'shop_owner',
                'phone' => '+251911223344',
                'telegram_user_id' => 12345678,
                'telegram_username' => 'jenny_sellmate',
                'is_active' => true,
            ]
        );

        // Shop Owner 2: Herbivore Botanicals
        User::firstOrCreate(
            ['email' => 'herbi@store.com'],
            [
                'name' => 'Abebe Herbal',
                'password' => Hash::make('12345678'),
                'role' => 'shop_owner',
                'phone' => '+251922334455',
                'telegram_username' => 'herbi_store',
                'is_active' => true,
            ]
        );
    }
}

