<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DeleteOrderAction
{
    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($order->status !== 'pending') {
                throw new ConflictHttpException('Hanya pesanan pending yang dapat dihapus.');
            }

            $items = $order->items()->get();
            $productIds = $items->pluck('product_id')->unique()->sort()->values();
            $products = Product::query()
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($items->groupBy('product_id') as $productId => $productItems) {
                $products->get($productId)->increment('stock', $productItems->sum('quantity'));
            }

            $order->delete();
        });
    }
}
