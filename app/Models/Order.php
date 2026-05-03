<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory, HasUuids;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_PAID = 'paid';
    public const STATUS_SOLD = 'sold';
    public const STATUS_REFUND = 'refund';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'product_id',
        'customer_name',
        'email',
        'phone',
        'address_street',
        'address_city',
        'address_postal_code',
        'address_country',
        'size',
        'sizes',
        'quantity',
        'status',
        'notes',
        'delivery_fee',
        'volume_discount',
        'inventory_deducted',
    ];

    protected $casts = [
        'sizes' => 'array',
        'inventory_deducted' => 'boolean',
        'volume_discount' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Count units per size for inventory restore / checks.
     *
     * @return array<string, int>
     */
    public static function applicableVolumeDiscount(int $quantity): float
    {
        $min = (int) config('boutique.volume_discount_min_quantity', 5);
        if ($quantity < $min) {
            return 0.0;
        }

        return round((float) config('boutique.volume_discount_amount', 250), 2);
    }

    /**
     * @return array{
     *   unit_price: float,
     *   quantity: int,
     *   gross_subtotal: float,
     *   volume_discount: float,
     *   product_subtotal: float,
     *   delivery_fee: float,
     *   total: float,
     *   volume_discount_min_quantity: int
     * }
     */
    public function financialSummary(): array
    {
        $unit = (float) ($this->product?->new_price ?? $this->product?->old_price ?? 0);
        $qty = (int) $this->quantity;
        $gross = round($unit * $qty, 2);
        $discount = round((float) ($this->volume_discount ?? 0), 2);
        $after = max(0, round($gross - $discount, 2));
        $delivery = round((float) ($this->delivery_fee ?? 0), 2);

        return [
            'unit_price' => $unit,
            'quantity' => $qty,
            'gross_subtotal' => $gross,
            'volume_discount' => $discount,
            'product_subtotal' => $after,
            'delivery_fee' => $delivery,
            'total' => round($after + $delivery, 2),
            'volume_discount_min_quantity' => (int) config('boutique.volume_discount_min_quantity', 5),
        ];
    }

    public function sizeCountsForInventory(): array
    {
        $qty = (int) $this->quantity;
        if ($qty < 1) {
            return [];
        }
        $sizes = $this->sizes;
        if (is_array($sizes) && count($sizes) === $qty) {
            return array_count_values(array_values($sizes));
        }
        $one = $this->size;
        if (! $one) {
            return [];
        }

        return [$one => $qty];
    }

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING   => 'En attente',
            self::STATUS_CONFIRMED => 'Confirmée',
            self::STATUS_PAID      => 'Payée',
            self::STATUS_SOLD      => 'Vendue / Expédiée',
            self::STATUS_REFUND    => 'Remboursée',
            self::STATUS_CANCELLED => 'Annulée',
        ];
    }
}
