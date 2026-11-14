<?php

namespace App\Http\Controllers;

use App\Actions\CreateOrderAction;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
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
}
