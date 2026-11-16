<?php

namespace App\Http\Controllers;

use App\Actions\CreateOrderAction;
use App\Actions\DeleteOrderAction;
use App\Actions\UpdateOrderAction;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;

final class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(): View
    {
        return view('payment');
    }

    /**
     * Return an empty order payload for API clients.
     */
    public function create(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'items' => [],
                'recipient_name' => '',
                'recipient_phone' => '',
                'shipping_street' => '',
                'shipping_city' => '',
                'shipping_province' => '',
                'shipping_postal_code' => null,
                'payment_method' => '',
                'notes' => null,
            ],
        ]);
    }

    /**
     * Process a new order.
     *
     * Validates cart items, checks stock, deducts inventory,
     * and creates Order + OrderItem records via CreateOrderAction.
     */
    public function store(StoreOrderRequest $request, CreateOrderAction $action): JsonResponse
    {
        $order = $action->execute($request->validated());

        return (new OrderResource($order))
            ->additional([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Return an order for API clients to edit.
     */
    public function edit(Order $order): JsonResponse
    {
        return (new OrderResource($order->load('items')))
            ->additional([
                'success' => true,
                'message' => 'Data pesanan berhasil dimuat.',
            ])
            ->response();
    }

    /**
     * Update a pending order and synchronize its reserved inventory.
     */
    public function update(StoreOrderRequest $request, Order $order, UpdateOrderAction $action): JsonResponse
    {
        $updatedOrder = $action->execute($order, $request->validated());

        return (new OrderResource($updatedOrder))
            ->additional([
                'success' => true,
                'message' => 'Pesanan berhasil diperbarui.',
            ])
            ->response();
    }

    /**
     * Delete a pending order and return its reserved inventory.
     */
    public function destroy(Order $order, DeleteOrderAction $action): JsonResponse
    {
        $action->execute($order);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dihapus.',
        ]);
    }
}
