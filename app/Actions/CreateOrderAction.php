<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateOrderAction
{
    /**
     * Create a new order from validated request data.
     *
     * Wraps product lookup, stock validation, stock deduction, and order/item
     * creation inside a single database transaction to guarantee consistency.
     *
     * @param  array{
     *     items: array<int, array{product_id: int, quantity: int}>,
     *     recipient_name: string,
     *     recipient_phone: string,
     *     shipping_street: string,
     *     shipping_city: string,
     *     shipping_province: string,
     *     shipping_postal_code: ?string,
     *     payment_method: string,
     *     notes: ?string,
     * }  $data
     *
     * @throws ValidationException
     */
    public function execute(array $data): Order
    {
        return DB::transaction(function () use ($data): Order {
            $subtotal = 0;
            $orderItems = [];

            foreach ($data['items'] as $index => $item) {
                // Lock the row for update to prevent race conditions on stock
                $product = Product::query()
                    ->lockForUpdate()
                    ->find($item['product_id']);

                if ($product === null) {
                    throw ValidationException::withMessages([
                        "items.{$index}.product_id" => "Produk dengan ID {$item['product_id']} tidak ditemukan.",
                    ]);
                }

                $quantity = $item['quantity'];

                // Validate minimum order
                if ($quantity < $product->min_order) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => "Minimal pemesanan {$product->name} adalah {$product->min_order} {$product->min_order_unit}.",
                    ]);
                }

                // Validate stock availability
                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => "Stok {$product->name} tidak mencukupi. Tersedia: {$product->stock} {$product->stock_unit}.",
                    ]);
                }

                // Deduct stock
                $product->decrement('stock', $quantity);

                $lineTotal = $product->price * $quantity;
                $subtotal += $lineTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'price_unit' => $product->price_unit,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            }

            $order = Order::query()->create([
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'recipient_name' => $data['recipient_name'],
                'recipient_phone' => $data['recipient_phone'],
                'shipping_street' => $data['shipping_street'],
                'shipping_city' => $data['shipping_city'],
                'shipping_province' => $data['shipping_province'],
                'shipping_postal_code' => $data['shipping_postal_code'] ?? null,
                'payment_method' => $data['payment_method'],
                'subtotal' => $subtotal,
                'shipping_cost' => 0,
                'total' => $subtotal,
                'notes' => $data['notes'] ?? null,
            ]);

            $order->items()->createMany($orderItems);
            $order->load('items');

            return $order;
        });
    }
}
