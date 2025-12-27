<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeasonController extends Controller
{
    public function index(Request $request)
    {
        $seasons = Season::orderBy('start_date', 'desc')
            ->paginate(15)
            ->through(function ($season) {
                return [
                    'id' => $season->id,
                    'name' => $season->name,
                    'start_date' => $season->start_date->format('Y-m-d'),
                    'end_date' => $season->end_date->format('Y-m-d'),
                    'is_active' => $season->is_active,
                    'description' => $season->description,
                    'teams_count' => $season->teams()->count(),
                ];
            });

        return Inertia::render('admin/seasons/index', [
            'seasons' => $seasons,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/seasons/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // If setting as active, deactivate others
        if ($validated['is_active'] ?? false) {
            Season::where('is_active', true)->update(['is_active' => false]);
        }

        Season::create($validated);

        return redirect()->route('admin.seasons.index')
            ->with('success', 'Saison créée avec succès');
    }

    public function show(Season $season)
    {
        $season->load(['teams', 'competitions']);
        
        return Inertia::render('admin/seasons/show', [
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'start_date' => $season->start_date->format('Y-m-d'),
                'end_date' => $season->end_date->format('Y-m-d'),
                'is_active' => $season->is_active,
                'description' => $season->description,
                'teams' => $season->teams->map(fn($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                    'category' => $team->category,
                ]),
                'competitions' => $season->competitions->map(fn($comp) => [
                    'id' => $comp->id,
                    'name' => $comp->name,
                    'type' => $comp->type,
                ]),
            ],
        ]);
    }

    public function edit(Season $season)
    {
        return Inertia::render('admin/seasons/edit', [
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'start_date' => $season->start_date->format('Y-m-d'),
                'end_date' => $season->end_date->format('Y-m-d'),
                'is_active' => $season->is_active,
                'description' => $season->description,
            ],
        ]);
    }

    public function update(Request $request, Season $season)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // If setting as active, deactivate others
        if ($validated['is_active'] ?? false) {
            Season::where('id', '!=', $season->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $season->update($validated);

        return redirect()->route('admin.seasons.index')
            ->with('success', 'Saison mise à jour avec succès');
    }

    public function destroy(Season $season)
    {
        $season->delete();

        return redirect()->route('admin.seasons.index')
            ->with('success', 'Saison supprimée avec succès');
    }
}
