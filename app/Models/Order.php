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

    protected $fillable = [
        'product_id',
        'customer_name',
        'email',
        'phone',
        'size',
        'quantity',
        'status',
        'notes',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING   => 'En attente',
            self::STATUS_CONFIRMED => 'Confirmée',
            self::STATUS_PAID      => 'Payée',
            self::STATUS_SOLD      => 'Vendue / Expédiée',
            self::STATUS_REFUND    => 'Remboursée',
        ];
    }
}
