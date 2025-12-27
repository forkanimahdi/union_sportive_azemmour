<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'type',
        'category',
        'team_id',
        'player_id',
        'match_id',
        'training_id',
        'season_id',
        'description',
        'approved_for_social_media',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'approved_for_social_media' => 'boolean',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function canBeShared(): bool
    {
        if (!$this->approved_for_social_media) {
            return false;
        }

        if ($this->player_id) {
            $player = $this->player;
            $imageRight = $player->imageRight;
            
            if (!$imageRight || $imageRight->consent_status !== 'signe_diffusion_publique') {
                return false;
            }

            if ($imageRight->expiry_date && $imageRight->expiry_date->isPast()) {
                return false;
            }
        }

        return true;
    }
}
