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

    public function isValid(): bool
    {
        if ($this->consent_status === 'non_signe') {
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

    public function canBeUsedForSocialMedia(): bool
    {
        return $this->isValid() && $this->consent_status === 'signe_diffusion_publique';
    }
}
