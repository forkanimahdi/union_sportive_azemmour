<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentMovement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'equipment_id',
        'type',
        'quantity',
        'player_id',
        'team_id',
        'staff_id',
        'match_id',
        'notes',
        'processed_by',
        'expected_return_date',
        'actual_return_date',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'expected_return_date' => 'date',
            'actual_return_date' => 'date',
        ];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
