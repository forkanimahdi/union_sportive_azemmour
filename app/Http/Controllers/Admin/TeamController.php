<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::with(['season', 'players'])
            ->orderBy('category')
            ->orderBy('name')
            ->paginate(15)
            ->through(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'category' => $team->category,
                    'season' => $team->season ? [
                        'id' => $team->season->id,
                        'name' => $team->season->name,
                    ] : null,
                    'is_active' => $team->is_active,
                    'players_count' => $team->players()->count(),
                ];
            });

        return Inertia::render('admin/teams/index', [
            'teams' => $teams,
        ]);
    }

    public function create()
    {
        $seasons = Season::where('is_active', true)
            ->orWhere('is_active', false)
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ]);

        return Inertia::render('admin/teams/create', [
            'seasons' => $seasons,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'category' => 'required|in:U13,U15,U17,Senior',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Team::create($validated);

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe créée avec succès');
    }

    public function show(Team $team)
    {
        $team->load(['season', 'players', 'staff', 'trainings', 'matches']);
        
        return Inertia::render('admin/teams/show', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'category' => $team->category,
                'description' => $team->description,
                'is_active' => $team->is_active,
                'season' => $team->season ? [
                    'id' => $team->season->id,
                    'name' => $team->season->name,
                ] : null,
                'players' => $team->players->map(fn($p) => [
                    'id' => $p->id,
                    'first_name' => $p->first_name,
                    'last_name' => $p->last_name,
                    'position' => $p->position,
                ]),
                'staff' => $team->staff->map(fn($s) => [
                    'id' => $s->id,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'role' => $s->pivot->role,
                ]),
            ],
        ]);
    }

    public function edit(Team $team)
    {
        $seasons = Season::orderBy('start_date', 'desc')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ]);

        return Inertia::render('admin/teams/edit', [
            'team' => [
                'id' => $team->id,
                'season_id' => $team->season_id,
                'category' => $team->category,
                'name' => $team->name,
                'description' => $team->description,
                'is_active' => $team->is_active,
            ],
            'seasons' => $seasons,
        ]);
    }

    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'category' => 'required|in:U13,U15,U17,Senior',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $team->update($validated);

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe mise à jour avec succès');
    }

    public function destroy(Team $team)
    {
        $team->delete();

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe supprimée avec succès');
    }
}
