<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlayerDocument extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'player_id',
        'type',
        'file_path',
        'file_name',
        'issue_date',
        'expiry_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->expiry_date 
            && $this->expiry_date->isFuture() 
            && $this->expiry_date->diffInDays(now()) <= $days;
    }
}
