<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'season_id',
        'category',
        'name',
        'description',
        'is_active',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(Staff::class, 'team_staff')
            ->withPivot('role', 'is_primary', 'assigned_from', 'assigned_until')
            ->withTimestamps();
    }

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(GameMatch::class);
    }

    public function convoctions(): HasMany
    {
        return $this->hasMany(Convocation::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }
}
