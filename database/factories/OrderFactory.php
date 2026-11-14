<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(100000, 5000000);

        return [
            'order_number' => Order::generateOrderNumber(),
            'status' => 'pending',
            'recipient_name' => fake()->name(),
            'recipient_phone' => fake()->phoneNumber(),
            'shipping_street' => fake()->streetAddress(),
            'shipping_city' => fake()->city(),
            'shipping_province' => 'Jawa Timur',
            'shipping_postal_code' => fake()->postcode(),
            'payment_method' => fake()->randomElement(['transfer_bca', 'transfer_mandiri', 'gopay', 'dana', 'cod']),
            'subtotal' => $subtotal,
            'shipping_cost' => 0,
            'total' => $subtotal,
            'notes' => null,
        ];
    }
}
