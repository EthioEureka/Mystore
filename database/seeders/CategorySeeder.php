<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'Headphones'],
            ['name' => 'Beauty', 'slug' => 'beauty', 'icon' => 'Sparkles'],
            ['name' => 'Clothes', 'slug' => 'clothes', 'icon' => 'Shirt'],
            ['name' => 'Books', 'slug' => 'books', 'icon' => 'BookOpen'],
            ['name' => 'Home', 'slug' => 'home', 'icon' => 'Home'],
            ['name' => 'Sport', 'slug' => 'sport', 'icon' => 'Trophy'],
        ];

        foreach ($categoriesData as $idx => $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                    'display_order' => $idx + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}

