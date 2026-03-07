<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConcentrationConvocation extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'concentration_convocation';

    protected $fillable = [
        'concentration_id',
        'player_id',
        'status',
        'notes',
    ];

    public function concentration(): BelongsTo
    {
        return $this->belongsTo(Concentration::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public static function statuses(): array
    {
        return [
            'convoquee' => 'Convoquée',
            'presente' => 'Présente',
            'absente' => 'Absente',
            'forfait' => 'Forfait (blessure)',
        ];
    }
}
