<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Standing extends Model
{
    use HasUuids;

    protected $fillable = [
        'season_id',
        'category',
        'team_id',
        'opponent_team_id',
        'matches_played',
        'wins',
        'draws',
        'losses',
        'goals_for',
        'goals_against',
    ];

    protected function casts(): array
    {
        return [
            'matches_played' => 'integer',
            'wins' => 'integer',
            'draws' => 'integer',
            'losses' => 'integer',
            'goals_for' => 'integer',
            'goals_against' => 'integer',
        ];
    }

    public function getPointsAttribute(): int
    {
        return ($this->wins * 3) + $this->draws;
    }

    public function getGoalDifferenceAttribute(): int
    {
        return $this->goals_for - $this->goals_against;
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function opponentTeam(): BelongsTo
    {
        return $this->belongsTo(OpponentTeam::class, 'opponent_team_id');
    }

    /** Resolve display name: our team name or opponent name */
    public function getDisplayNameAttribute(): string
    {
        if ($this->team_id && $this->relationLoaded('team') && $this->team) {
            return $this->team->name;
        }
        if ($this->opponent_team_id && $this->relationLoaded('opponentTeam') && $this->opponentTeam) {
            return $this->opponentTeam->name;
        }
        return '–';
    }

    /** Short code for table display */
    public function getShortCodeAttribute(): string
    {
        $name = $this->display_name;
        if ($name === '–') {
            return '–';
        }
        $words = preg_split('/\s+/', $name, -1, PREG_SPLIT_NO_EMPTY);
        if (count($words) >= 2) {
            return strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1));
        }
        return strtoupper(mb_substr($name, 0, 2));
    }

    /** Check if this row is our club (USA) */
    public function getIsUsaAttribute(): bool
    {
        return $this->team_id !== null;
    }
}
