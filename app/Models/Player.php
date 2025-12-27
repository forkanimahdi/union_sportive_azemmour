<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Player extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'team_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'position',
        'preferred_foot',
        'jersey_number',
        'photo',
        'email',
        'phone',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_email',
        'guardian_relationship',
        'medical_certificate_path',
        'medical_certificate_expiry',
        'parental_authorization_path',
        'license_path',
        'license_number',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'medical_certificate_expiry' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function trainingAttendances(): HasMany
    {
        return $this->hasMany(TrainingAttendance::class);
    }

    public function injuries(): HasMany
    {
        return $this->hasMany(Injury::class);
    }

    public function disciplinaryActions(): HasMany
    {
        return $this->hasMany(DisciplinaryAction::class);
    }

    public function matchLineups(): HasMany
    {
        return $this->hasMany(MatchLineup::class);
    }

    public function matchEvents(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }

    public function convocations(): BelongsToMany
    {
        return $this->belongsToMany(Convocation::class, 'convocation_players')
            ->withPivot('status', 'block_reason', 'response')
            ->withTimestamps();
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function imageRight(): HasOne
    {
        return $this->hasOne(ImageRight::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PlayerDocument::class);
    }

    public function fullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isMinor(): bool
    {
        return $this->date_of_birth->age < 18;
    }

    public function isInjured(): bool
    {
        return $this->injuries()
            ->where('status', '!=', 'apte')
            ->where('fit_to_play', false)
            ->exists();
    }

    public function isSuspended(): bool
    {
        return $this->disciplinaryActions()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('suspension_end_date')
                    ->orWhere('suspension_end_date', '>=', now());
            })
            ->exists();
    }

    public function canPlay(): bool
    {
        return $this->is_active 
            && !$this->isInjured() 
            && !$this->isSuspended()
            && $this->hasValidMedicalCertificate();
    }

    public function hasValidMedicalCertificate(): bool
    {
        return $this->medical_certificate_path 
            && $this->medical_certificate_expiry 
            && $this->medical_certificate_expiry->isFuture();
    }
}
