<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Role helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTechnicalDirector(): bool
    {
        return $this->role === 'technical_director';
    }

    public function isCoach(): bool
    {
        return $this->role === 'coach';
    }

    public function isPhysiotherapist(): bool
    {
        return $this->role === 'physiotherapist';
    }

    public function isCommunication(): bool
    {
        return $this->role === 'communication';
    }

    public function isPresident(): bool
    {
        return $this->role === 'president';
    }

    public function canManageClub(): bool
    {
        return in_array($this->role, ['admin', 'technical_director']);
    }

    public function canManagePlayers(): bool
    {
        return in_array($this->role, ['admin', 'technical_director', 'coach']);
    }

    public function canManageMedia(): bool
    {
        return in_array($this->role, ['admin', 'communication', 'technical_director']);
    }
}
