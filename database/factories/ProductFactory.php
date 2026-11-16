<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'category_id' => Category::factory(),
            'price' => fake()->numberBetween(10000, 150000),
            'price_unit' => 'kg',
            'min_order' => fake()->numberBetween(1, 50),
            'min_order_unit' => 'kg',
            'stock' => fake()->numberBetween(50, 5000),
            'stock_unit' => 'kg',
            'location' => fake()->city().', '.fake()->state(),
            'province' => 'Jawa Timur',
            'rating' => fake()->randomFloat(1, 4, 5),
            'sold_count' => (string) fake()->numberBetween(10, 1000),
            'image' => '/assets/images/pexels-shvets-production-8900041.jpg',
            'description' => fake()->paragraph(),
        ];
    }
}
