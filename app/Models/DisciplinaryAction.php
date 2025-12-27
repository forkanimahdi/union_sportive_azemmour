<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisciplinaryAction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'player_id',
        'match_id',
        'card_type',
        'suspension_matches',
        'suspension_start_date',
        'suspension_end_date',
        'reason',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'suspension_start_date' => 'date',
            'suspension_end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }
}
