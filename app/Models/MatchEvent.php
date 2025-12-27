<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchEvent extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'match_id',
        'player_id',
        'type',
        'minute',
        'description',
        'substituted_player_id',
    ];

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function substitutedPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'substituted_player_id');
    }
}
