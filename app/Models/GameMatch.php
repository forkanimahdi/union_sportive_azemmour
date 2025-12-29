<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameMatch extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'matches';

    protected $fillable = [
        'competition_id',
        'team_id',
        'opponent',
        'opponent_team_id',
        'category',
        'scheduled_at',
        'venue',
        'type',
        'home_score',
        'away_score',
        'status',
        'match_report',
        'coach_notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function opponentTeam(): BelongsTo
    {
        return $this->belongsTo(OpponentTeam::class, 'opponent_team_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }

    public function lineups(): HasMany
    {
        return $this->hasMany(MatchLineup::class);
    }

    public function convoctions(): HasMany
    {
        return $this->hasMany(Convocation::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function equipmentMovements(): HasMany
    {
        return $this->hasMany(EquipmentMovement::class);
    }

    public function getScoreAttribute(): string
    {
        if ($this->home_score === null || $this->away_score === null) {
            return '-';
        }
        return $this->type === 'domicile' 
            ? "{$this->home_score} - {$this->away_score}"
            : "{$this->away_score} - {$this->home_score}";
    }
}
