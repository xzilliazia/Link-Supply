<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'category_id',
        'name',
        'price',
        'price_unit',
        'min_order',
        'min_order_unit',
        'stock',
        'stock_unit',
        'location',
        'province',
        'rating',
        'sold_count',
        'image',
        'description',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'min_order' => 'integer',
            'stock' => 'integer',
            'rating' => 'float',
        ];
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
