<?php

namespace App\Models;

use InvalidArgumentException;

final class Product
{
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly string $category,
        private readonly string $categoryLabel,
        private readonly string $categoryIcon,
        private readonly int $price,
        private readonly string $priceUnit,
        private readonly int $minOrder,
        private readonly string $minOrderUnit,
        private readonly int $stock,
        private readonly string $stockUnit,
        private readonly string $location,
        private readonly string $province,
        private readonly float $rating,
        private readonly string $soldCount,
        private readonly string $image,
        private readonly string $description
    ) {
    }

    public static function fromArray(array $data): self
    {
        $requiredFields = [
            'id' => 'integer',
            'name' => 'string',
            'category' => 'string',
            'categoryLabel' => 'string',
            'categoryIcon' => 'string',
            'price' => 'integer',
            'priceUnit' => 'string',
            'minOrder' => 'integer',
            'minOrderUnit' => 'string',
            'stock' => 'integer',
            'stockUnit' => 'string',
            'location' => 'string',
            'province' => 'string',
            'rating' => 'number',
            'soldCount' => 'string',
            'image' => 'string',
            'desc' => 'string',
        ];

        foreach ($requiredFields as $field => $type) {
            $valid = match ($type) {
                'integer' => isset($data[$field]) && is_int($data[$field]),
                'number' => isset($data[$field]) && (is_float($data[$field]) || is_int($data[$field])),
                default => isset($data[$field]) && is_string($data[$field]),
            };

            if (!$valid) {
                throw new InvalidArgumentException("Invalid or missing product field: {$field}");
            }
        }

        $image = $data['image'];
        if (!str_starts_with($image, '/') && !str_starts_with($image, 'http')) {
            $image = '/' . $image;
        }

        return new self(
            $data['id'],
            $data['name'],
            $data['category'],
            $data['categoryLabel'],
            $data['categoryIcon'],
            $data['price'],
            $data['priceUnit'],
            $data['minOrder'],
            $data['minOrderUnit'],
            $data['stock'],
            $data['stockUnit'],
            $data['location'],
            $data['province'],
            (float) $data['rating'],
            $data['soldCount'],
            $image,
            $data['desc']
        );
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function getCategoryLabel(): string
    {
        return $this->categoryLabel;
    }

    public function getCategoryIcon(): string
    {
        return $this->categoryIcon;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function getPriceUnit(): string
    {
        return $this->priceUnit;
    }

    public function getMinOrder(): int
    {
        return $this->minOrder;
    }

    public function getMinOrderUnit(): string
    {
        return $this->minOrderUnit;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function getStockUnit(): string
    {
        return $this->stockUnit;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function getProvince(): string
    {
        return $this->province;
    }

    public function getRating(): float
    {
        return $this->rating;
    }

    public function getSoldCount(): string
    {
        return $this->soldCount;
    }

    public function getImage(): string
    {
        return $this->image;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'categoryLabel' => $this->categoryLabel,
            'categoryIcon' => $this->categoryIcon,
            'price' => $this->price,
            'priceUnit' => $this->priceUnit,
            'minOrder' => $this->minOrder,
            'minOrderUnit' => $this->minOrderUnit,
            'stock' => $this->stock,
            'stockUnit' => $this->stockUnit,
            'location' => $this->location,
            'province' => $this->province,
            'rating' => $this->rating,
            'soldCount' => $this->soldCount,
            'image' => $this->image,
            'desc' => $this->description,
        ];
    }

    public function toDetailView(): array
    {
        $available = $this->stock > 0;

        return [
            'id' => $this->id,
            'title' => $this->name,
            'image' => $this->image,
            'pricing' => [
                'amount' => $this->price,
                'unit' => $this->priceUnit,
            ],
            'sales' => ['sold' => $this->soldCount],
            'rating' => ['value' => $this->rating],
            'inventory' => [
                'stock' => $this->stock,
                'unit' => $this->stockUnit,
                'minimum' => $this->minOrder,
                'minimumLabel' => number_format($this->minOrder, 0, ',', '.') . ' ' . $this->minOrderUnit,
                'available' => $available,
                'status' => $available ? 'Siap dipasok' : 'Stok habis',
                'message' => $available ? '' : 'Pasokan ini sedang habis. Silakan cek kembali nanti.',
            ],
            'specs' => [
                'condition' => $available ? 'Tersedia' : 'Stok habis',
                'unitWeight' => '1 ' . $this->priceUnit,
                'category' => $this->categoryLabel,
                'location' => $this->location,
                'province' => $this->province,
                'description' => $this->description,
            ],
        ];
    }
}
