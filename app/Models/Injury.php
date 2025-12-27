<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Injury extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'player_id',
        'reported_by',
        'type',
        'description',
        'injury_date',
        'severity',
        'status',
        'estimated_recovery_date',
        'actual_recovery_date',
        'fit_to_play',
        'validated_by',
        'validated_at',
        'medical_notes',
    ];

    protected function casts(): array
    {
        return [
            'injury_date' => 'date',
            'estimated_recovery_date' => 'date',
            'actual_recovery_date' => 'date',
            'fit_to_play' => 'boolean',
            'validated_at' => 'datetime',
        ];
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'reported_by');
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'validated_by');
    }
}
