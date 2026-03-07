<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConcentrationDay extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'concentration_id',
        'date',
        'coach_notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function concentration(): BelongsTo
    {
        return $this->belongsTo(Concentration::class);
    }

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class, 'concentration_day_id');
    }

    public function meals(): HasMany
    {
        return $this->hasMany(ConcentrationDayMeal::class, 'concentration_day_id');
    }
}
