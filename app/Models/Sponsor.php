<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'logo', 'url', 'type', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'sort_order' => 'integer'];
    }

    public const TYPE_OFFICIAL = 'sponsor_official';
    public const TYPE_SPONSOR = 'sponsor';
    public const TYPE_PARTNER = 'partner';

    public static function typeLabels(): array
    {
        return [
            self::TYPE_OFFICIAL => 'Sponsor officiel',
            self::TYPE_SPONSOR => 'Sponsor',
            self::TYPE_PARTNER => 'Partenaire institutionnel',
        ];
    }
}
