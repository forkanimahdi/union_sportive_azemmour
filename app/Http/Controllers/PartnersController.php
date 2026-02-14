<?php

namespace App\Http\Controllers;

use App\Models\Sponsor;
use Inertia\Inertia;

class PartnersController extends Controller
{
    public function index()
    {
        $sponsors = Sponsor::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'logo' => $s->logo,
                'url' => $s->url,
                'type' => $s->type,
            ]);

        return Inertia::render('Partners/index', [
            'sponsors' => $sponsors->values()->all(),
        ]);
    }
}
