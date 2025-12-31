<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class OpponentTeam extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'logo',
        'rank',
        'matches_played',
        'wins',
        'draws',
        'losses',
        'goals_for',
        'goals_against',
        'points',
    ];

    protected function casts(): array
    {
        return [
            'rank' => 'integer',
            'matches_played' => 'integer',
            'wins' => 'integer',
            'draws' => 'integer',
            'losses' => 'integer',
            'goals_for' => 'integer',
            'goals_against' => 'integer',
            'points' => 'integer',
        ];
    }

    public function matches(): HasMany
    {
        return $this->hasMany(GameMatch::class, 'opponent_team_id');
    }

    public function getGoalDifferenceAttribute(): int
    {
        return $this->goals_for - $this->goals_against;
    }
}
