<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Concentration extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'location',
        'accommodation',
        'objective',
        'responsible_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'responsible_id');
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'concentration_team')->withTimestamps();
    }

    public function days(): HasMany
    {
        return $this->hasMany(ConcentrationDay::class)->orderBy('date');
    }

    public function convocation(): HasMany
    {
        return $this->hasMany(ConcentrationConvocation::class, 'concentration_id');
    }

    public function getDurationDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    public static function objectives(): array
    {
        return [
            'preparation_match' => 'Préparation match',
            'cohesion' => 'Cohésion',
            'physique' => 'Physique',
            'autre' => 'Autre',
        ];
    }
}
