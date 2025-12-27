<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Convocation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'team_id',
        'type',
        'match_id',
        'training_id',
        'meeting_time',
        'meeting_location',
        'instructions',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'meeting_time' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function players(): BelongsToMany
    {
        return $this->belongsToMany(Player::class, 'convocation_players')
            ->withPivot('status', 'block_reason', 'response')
            ->withTimestamps();
    }
}
