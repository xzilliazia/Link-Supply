<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'order_number',
        'status',
        'recipient_name',
        'recipient_phone',
        'shipping_street',
        'shipping_city',
        'shipping_province',
        'shipping_postal_code',
        'payment_method',
        'subtotal',
        'shipping_cost',
        'total',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'integer',
            'shipping_cost' => 'integer',
            'total' => 'integer',
        ];
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        return 'LS-'.now()->format('Ymd').'-'.strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
    }
}
