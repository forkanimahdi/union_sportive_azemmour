<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'role',
        'specialization',
        'license_number',
        'hire_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_staff')
            ->withPivot('role', 'is_primary', 'assigned_from', 'assigned_until')
            ->withTimestamps();
    }

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class, 'coach_id');
    }

    public function reportedInjuries(): HasMany
    {
        return $this->hasMany(Injury::class, 'reported_by');
    }

    public function validatedInjuries(): HasMany
    {
        return $this->hasMany(Injury::class, 'validated_by');
    }

    public function fullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
