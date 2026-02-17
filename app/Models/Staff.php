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

    /** Display section for About page (bureau = administrative). */
    public const SECTIONS = [
        'bureau' => 'Bureau / Administratif',
        'coach' => 'Encadrement technique',
        'soigneur' => 'Soigneurs & Médical',
        'other' => 'Autre',
    ];

    public const SECTION_KEYS = ['bureau', 'coach', 'soigneur', 'other'];

    /** Staff technique + bureau roles (DB + pivot team_staff). */
    public const ROLES = [
        'president' => 'Président(e)',
        'vice_president' => 'Vice-Président(e)',
        'secretary' => 'Secrétaire',
        'treasurer' => 'Trésorier(ère)',
        'technical_director' => 'Directeur technique',
        'head_coach' => 'Coach',
        'assistant_coach' => 'Assistant coach',
        'goalkeeper_coach' => 'Coach Gardiennes',
        'physiotherapist' => 'Soigneur',
        'doctor' => 'Médecin',
        'communication' => 'Communication',
        'equipment_manager' => 'Gestionnaire équipement',
    ];

    public const ROLE_KEYS = [
        'president', 'vice_president', 'secretary', 'treasurer',
        'technical_director', 'head_coach', 'assistant_coach', 'goalkeeper_coach',
        'physiotherapist', 'doctor', 'communication', 'equipment_manager',
    ];

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'image',
        'role',
        'section',
        'priority',
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

    public function getRoleLabelAttribute(): string
    {
        return self::ROLES[$this->role] ?? $this->role;
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
