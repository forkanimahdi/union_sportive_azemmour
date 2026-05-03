<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasUuids;

    public const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    protected $fillable = [
        'name',
        'description',
        'image',
        'image_without_logo',
        'image_customized_tshirt',
        'old_price',
        'new_price',
        'product_category_id',
        'is_active',
        'stock_by_size',
    ];

    protected function casts(): array
    {
        return [
            'old_price' => 'decimal:2',
            'new_price' => 'decimal:2',
            'is_active' => 'boolean',
            'stock_by_size' => 'array',
        ];
    }

    /**
     * @return array<string, int>
     */
    public function normalizedStockBySize(): array
    {
        $raw = $this->stock_by_size;
        if (! is_array($raw)) {
            $raw = [];
        }
        $out = [];
        foreach (self::SIZES as $size) {
            $out[$size] = max(0, (int) ($raw[$size] ?? 0));
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>|null  $input
     * @return array<string, int>
     */
    public static function normalizeStockInput(?array $input): array
    {
        $input = is_array($input) ? $input : [];
        $out = [];
        foreach (self::SIZES as $size) {
            $out[$size] = max(0, (int) ($input[$size] ?? 0));
        }

        return $out;
    }

    /**
     * @param  array<string, int>  $sizeCounts  e.g. ['M' => 2, 'L' => 1]
     */
    public function hasStockForSizeCounts(array $sizeCounts): bool
    {
        $stock = $this->normalizedStockBySize();
        foreach ($sizeCounts as $size => $need) {
            if (! in_array($size, self::SIZES, true)) {
                return false;
            }
            if (($stock[$size] ?? 0) < $need) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  array<string, int>  $sizeCounts
     */
    public function decrementStockForSizes(array $sizeCounts): void
    {
        $stock = $this->normalizedStockBySize();
        foreach ($sizeCounts as $size => $need) {
            $stock[$size] -= $need;
        }
        $this->stock_by_size = $stock;
        $this->save();
    }

    /**
     * @param  array<string, int>  $sizeCounts
     */
    public function incrementStockForSizes(array $sizeCounts): void
    {
        $stock = $this->normalizedStockBySize();
        foreach ($sizeCounts as $size => $need) {
            $stock[$size] += $need;
        }
        $this->stock_by_size = $stock;
        $this->save();
    }

    public function totalStockUnits(): int
    {
        return array_sum($this->normalizedStockBySize());
    }

    public function isFullyOutOfStock(): bool
    {
        return $this->totalStockUnits() === 0;
    }

    /**
     * @return list<array{size: string, qty: int}>
     */
    public function lowStockEntries(?int $threshold = null): array
    {
        $threshold = $threshold ?? (int) config('boutique.low_stock_threshold', 5);
        $entries = [];
        foreach ($this->normalizedStockBySize() as $size => $qty) {
            if ($qty > 0 && $qty <= $threshold) {
                $entries[] = ['size' => $size, 'qty' => $qty];
            }
        }

        return $entries;
    }

    /**
     * Summary for admin lists (badges / alerts).
     *
     * @return array{total: int, out_of_stock: bool, low_stock: list<array{size: string, qty: int}>, low_stock_threshold: int}
     */
    public function stockSummaryForAdmin(): array
    {
        $threshold = (int) config('boutique.low_stock_threshold', 5);
        $low = $this->lowStockEntries($threshold);

        return [
            'total' => $this->totalStockUnits(),
            'out_of_stock' => $this->isFullyOutOfStock(),
            'low_stock' => $low,
            'low_stock_threshold' => $threshold,
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
