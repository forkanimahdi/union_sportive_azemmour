<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImageRight extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    /** Consent levels (blueprint): no export/share if not validated. */
    public const CONSENT_NON_SIGNE = 'non_signe';
    public const CONSENT_USAGE_INTERNE = 'signe_usage_interne';
    public const CONSENT_DIFFUSION_PUBLIQUE = 'signe_diffusion_publique';

    protected $fillable = [
        'player_id',
        'consent_status',
        'document_path',
        'signed_date',
        'expiry_date',
        'signed_by',
        'is_minor',
        'guardian_name',
        'guardian_signature_path',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'signed_date' => 'date',
            'expiry_date' => 'date',
            'is_minor' => 'boolean',
        ];
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    /** Valid = signed and (if minor) guardian signed; expiry respected. */
    public function isValid(): bool
    {
        if ($this->consent_status === self::CONSENT_NON_SIGNE) {
            return false;
        }

        if ($this->expiry_date && $this->expiry_date->isPast()) {
            return false;
        }

        if ($this->is_minor && !$this->guardian_signature_path) {
            return false;
        }

        return true;
    }

    /** USAGE_INTERNE: allowed for internal dashboard only. */
    public function canBeUsedInternally(): bool
    {
        return $this->isValid() && in_array($this->consent_status, [
            self::CONSENT_USAGE_INTERNE,
            self::CONSENT_DIFFUSION_PUBLIQUE,
        ], true);
    }

    /** DIFFUSION_PUBLIQUE: allowed for social media / external export. */
    public function canBeUsedForSocialMedia(): bool
    {
        return $this->isValid() && $this->consent_status === self::CONSENT_DIFFUSION_PUBLIQUE;
    }
}
