<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'description',
        'quantity_total',
        'quantity_available',
        'size',
        'brand',
        'reference',
        'unit_price',
        'purchase_date',
        'condition',
        'responsible_staff_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity_total' => 'integer',
            'quantity_available' => 'integer',
            'unit_price' => 'decimal:2',
            'purchase_date' => 'date',
        ];
    }

    public function responsibleStaff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'responsible_staff_id');
    }

    public function movements(): HasMany
    {
        return $this->hasMany(EquipmentMovement::class);
    }

    public function updateAvailableQuantity(): void
    {
        $outMovements = $this->movements()
            ->whereIn('type', ['sortie', 'perte', 'dommage'])
            ->sum('quantity');
        
        $inMovements = $this->movements()
            ->whereIn('type', ['retour', 'ajout'])
            ->sum('quantity');
        
        $this->quantity_available = $this->quantity_total - $outMovements + $inMovements;
        $this->save();
    }
}
