<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array matching the frontend JSON contract.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category->slug,
            'categoryLabel' => $this->category->name,
            'categoryIcon' => $this->category->icon ?? 'wheat',
            'price' => $this->price,
            'priceUnit' => $this->price_unit,
            'minOrder' => $this->min_order,
            'minOrderUnit' => $this->min_order_unit,
            'stock' => $this->stock,
            'stockUnit' => $this->stock_unit,
            'location' => $this->location,
            'province' => $this->province,
            'rating' => $this->rating,
            'soldCount' => $this->sold_count,
            'image' => $this->imageUrl(),
            'desc' => $this->description,
        ];
    }

    private function imageUrl(): string
    {
        $image = (string) $this->image;

        return str_starts_with($image, '/') || str_starts_with($image, 'http')
            ? $image
            : '/'.$image;
    }
}
