<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConvocationPlayer extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'convocation_players';

    protected $fillable = [
        'convocation_id',
        'player_id',
        'status',
        'block_reason',
        'response',
    ];

    public function convocation(): BelongsTo
    {
        return $this->belongsTo(Convocation::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}
