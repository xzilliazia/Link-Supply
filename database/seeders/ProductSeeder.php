<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataPath = resource_path('data/products.json');

        if (! file_exists($dataPath)) {
            throw new RuntimeException("Data file not found: {$dataPath}");
        }

        $json = file_get_contents($dataPath);
        $products = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

        $categories = [];

        foreach ($products as $item) {
            $categories[$item['category']] = [
                'slug' => $item['category'],
                'name' => $item['categoryLabel'],
                'icon' => $item['categoryIcon'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $categoryIds = [];
        foreach ($categories as $category) {
            $categoryIds[$category['slug']] = Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name'], 'icon' => $category['icon']]
            )->id;
        }

        foreach ($products as $item) {
            Product::query()->updateOrCreate(
                ['id' => $item['id']],
                [
                    'name' => $item['name'],
                    'category_id' => $categoryIds[$item['category']],
                    'price' => (int) $item['price'],
                    'price_unit' => $item['priceUnit'] ?? 'kg',
                    'min_order' => (int) ($item['minOrder'] ?? 1),
                    'min_order_unit' => $item['minOrderUnit'] ?? 'kg',
                    'stock' => (int) ($item['stock'] ?? 0),
                    'stock_unit' => $item['stockUnit'] ?? 'kg',
                    'location' => $item['location'],
                    'province' => $item['province'],
                    'rating' => (float) ($item['rating'] ?? 5.0),
                    'sold_count' => (string) ($item['soldCount'] ?? '0'),
                    'image' => $item['image'],
                    'description' => $item['desc'] ?? '',
                ]
            );
        }
    }
}
