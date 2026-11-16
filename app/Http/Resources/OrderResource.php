<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Order $this */
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'recipient' => [
                'name' => $this->recipient_name,
                'phone' => $this->recipient_phone,
            ],
            'shipping_address' => [
                'street' => $this->shipping_street,
                'city' => $this->shipping_city,
                'province' => $this->shipping_province,
                'postal_code' => $this->shipping_postal_code,
            ],
            'payment_method' => $this->payment_method,
            'subtotal' => $this->subtotal,
            'shipping_cost' => $this->shipping_cost,
            'total' => $this->total,
            'notes' => $this->notes,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'unit_price' => $item->unit_price,
                'price_unit' => $item->price_unit,
                'quantity' => $item->quantity,
                'line_total' => $item->line_total,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
