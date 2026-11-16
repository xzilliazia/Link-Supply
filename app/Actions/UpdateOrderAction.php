<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class UpdateOrderAction
{
    /**
     * Replace a pending order and its reserved inventory.
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
     */
    public function execute(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data): Order {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($order->status !== 'pending') {
                throw new ConflictHttpException('Hanya pesanan pending yang dapat diubah.');
            }

            $existingItems = $order->items()->get();
            $productIds = $existingItems->pluck('product_id')
                ->merge(collect($data['items'])->pluck('product_id'))
                ->unique()
                ->sort()
                ->values();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($existingItems->groupBy('product_id') as $productId => $items) {
                $products->get($productId)->increment('stock', $items->sum('quantity'));
            }

            $subtotal = 0;
            $orderItems = [];

            foreach ($data['items'] as $index => $item) {
                $product = $products->get($item['product_id']);

                if ($product === null) {
                    throw ValidationException::withMessages([
                        "items.{$index}.product_id" => "Produk dengan ID {$item['product_id']} tidak ditemukan.",
                    ]);
                }

                if ($item['quantity'] < $product->min_order) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => "Minimal pemesanan {$product->name} adalah {$product->min_order} {$product->min_order_unit}.",
                    ]);
                }

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => "Stok {$product->name} tidak mencukupi. Tersedia: {$product->stock} {$product->stock_unit}.",
                    ]);
                }

                $product->decrement('stock', $item['quantity']);

                $lineTotal = $product->price * $item['quantity'];
                $subtotal += $lineTotal;
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'price_unit' => $product->price_unit,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            unset($data['items']);

            $order->fill($data);
            $order->subtotal = $subtotal;
            $order->total = $subtotal + $order->shipping_cost;
            $order->save();

            $order->items()->delete();
            $order->items()->createMany($orderItems);

            return $order->load('items');
        });
    }
}
