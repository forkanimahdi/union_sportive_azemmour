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

    /** Primary team (for display / backward compatibility). */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** All teams this player is assigned to (e.g. U17 + Senior). */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'player_team')
            ->withPivot('is_primary')
            ->withTimestamps();
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

    /**
     * Medical gate: blocked if any injury is "En soins", "Reprise" or not medically cleared.
     * Only "Apte" (fit) with fit_to_play = true allows play.
     */
    public function isInjured(): bool
    {
        return $this->injuries()
            ->where(function ($query) {
                $query->whereIn('status', ['en_soins', 'reprise_progressive'])
                    ->orWhere('fit_to_play', false);
            })
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

    /**
     * Fit-to-Play: all three gates must pass (Medical, Disciplinary, Administrative).
     */
    public function canPlay(): bool
    {
        return $this->is_active
            && !$this->isInjured()
            && !$this->isSuspended()
            && $this->hasValidMedicalCertificate()
            && $this->hasValidLicense()
            && $this->hasParentalAuthorizationWhenMinor();
    }

    public function hasValidMedicalCertificate(): bool
    {
        return $this->medical_certificate_path
            && $this->medical_certificate_expiry
            && !$this->medical_certificate_expiry->isPast();
    }

    /** Administrative gate: valid license required. */
    public function hasValidLicense(): bool
    {
        return !empty($this->license_number) && !empty($this->license_path);
    }

    /** Administrative gate: minors must have signed parental authorization. */
    public function hasParentalAuthorizationWhenMinor(): bool
    {
        if (!$this->date_of_birth || !$this->isMinor()) {
            return true;
        }
        return !empty($this->parental_authorization_path);
    }

    /**
     * Returns the reason a player is blocked from match convocation (or null if fit to play).
     * Use for gatekeeping when adding players to convocations.
     */
    public function getFitToPlayBlockReason(): ?string
    {
        if (!$this->is_active) {
            return __('Joueuse inactive');
        }
        if ($this->isInjured()) {
            return __('Indisponible médicalement (blessure en soins / reprise ou non apte)');
        }
        if ($this->isSuspended()) {
            return __('Suspendue (discipline)');
        }
        if (!$this->hasValidMedicalCertificate()) {
            return __('Certificat médical absent ou expiré');
        }
        if (!$this->hasValidLicense()) {
            return __('Licence invalide ou manquante');
        }
        if (!$this->hasParentalAuthorizationWhenMinor()) {
            return __('Autorisation parentale manquante (mineure)');
        }
        return null;
    }
}
