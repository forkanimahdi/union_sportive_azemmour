<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Training extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'trainings';

    protected $fillable = [
        'team_id',
        'coach_id',
        'scheduled_at',
        'location',
        'objectives',
        'rpe',
        'coach_notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function coach(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'coach_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(TrainingAttendance::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function convoctions(): HasMany
    {
        return $this->hasMany(Convocation::class);
    }
}
