<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function __invoke(Request $request)
    {
        $staff = Staff::where('is_active', true)->get();

        $sortByPriority = fn ($c) => $c->sortBy(fn ($s) => $s->priority ?? 999)->values();
        $bureau = $sortByPriority($staff->where('section', 'bureau'));
        $coach = $sortByPriority($staff->where('section', 'coach'));
        $soigneur = $sortByPriority($staff->where('section', 'soigneur'));
        $other = $sortByPriority($staff->filter(fn ($s) => in_array($s->section, ['other', null], true)));

        $bySection = [
            'bureau' => $bureau->map(fn ($s) => $this->staffToPublic($s))->all(),
            'coach' => $coach->map(fn ($s) => $this->staffToPublic($s))->all(),
            'soigneur' => $soigneur->map(fn ($s) => $this->staffToPublic($s))->all(),
            'other' => $other->map(fn ($s) => $this->staffToPublic($s))->all(),
        ];

        return Inertia::render('About/index', [
            'staffBySection' => $bySection,
        ]);
    }

    private function staffToPublic(Staff $s): array
    {
        return [
            'id' => $s->id,
            'first_name' => $s->first_name,
            'last_name' => $s->last_name,
            'role' => $s->role,
            'role_label' => Staff::ROLES[$s->role] ?? $s->role,
            'section' => $s->section,
            'section_label' => Staff::SECTIONS[$s->section] ?? $s->section,
            'priority' => $s->priority,
            'image' => $s->image ? '/storage/' . $s->image : null,
        ];
    }
}
