<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConcentrationDayMeal extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'concentration_day_id',
        'type',
        'time_slot',
    ];

    public function concentrationDay(): BelongsTo
    {
        return $this->belongsTo(ConcentrationDay::class, 'concentration_day_id');
    }

    public static function mealTypes(): array
    {
        return [
            'petit_dejeuner' => 'Petit-déjeuner',
            'dejeuner' => 'Déjeuner',
            'diner' => 'Dîner',
            'sieste' => 'Sieste',
        ];
    }
}
