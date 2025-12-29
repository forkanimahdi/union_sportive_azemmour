<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OpponentTeam;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OpponentTeamController extends Controller
{
    public function index()
    {
        // Get all teams and calculate goal difference
        $teams = OpponentTeam::get()
            ->map(function($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => $team->logo,
                    'rank' => $team->rank,
                    'matches_played' => $team->matches_played,
                    'wins' => $team->wins,
                    'draws' => $team->draws,
                    'losses' => $team->losses,
                    'goals_for' => $team->goals_for,
                    'goals_against' => $team->goals_against,
                    'goal_difference' => $team->goal_difference,
                    'points' => $team->points,
                ];
            });

        return Inertia::render('admin/opponent-teams/index', [
            'teams' => $teams,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/opponent-teams/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('opponent-teams', 'public');
        }

        OpponentTeam::create($validated);

        return redirect()->route('admin.opponent-teams.index')
            ->with('success', 'Équipe adverse créée avec succès');
    }

    public function show(OpponentTeam $opponentTeam)
    {
        $opponentTeam->load('matches');

        return Inertia::render('admin/opponent-teams/show', [
            'team' => [
                'id' => $opponentTeam->id,
                'name' => $opponentTeam->name,
                'logo' => $opponentTeam->logo,
                'rank' => $opponentTeam->rank,
                'matches_played' => $opponentTeam->matches_played,
                'wins' => $opponentTeam->wins,
                'draws' => $opponentTeam->draws,
                'losses' => $opponentTeam->losses,
                'goals_for' => $opponentTeam->goals_for,
                'goals_against' => $opponentTeam->goals_against,
                'goal_difference' => $opponentTeam->goal_difference,
                'points' => $opponentTeam->points,
                'matches' => $opponentTeam->matches->map(function($match) {
                    return [
                        'id' => $match->id,
                        'scheduled_at' => $match->scheduled_at?->format('Y-m-d H:i'),
                        'status' => $match->status,
                        'home_score' => $match->home_score,
                        'away_score' => $match->away_score,
                    ];
                }),
            ],
        ]);
    }

    public function edit(OpponentTeam $opponentTeam)
    {
        return Inertia::render('admin/opponent-teams/edit', [
            'team' => [
                'id' => $opponentTeam->id,
                'name' => $opponentTeam->name,
                'logo' => $opponentTeam->logo,
                'rank' => $opponentTeam->rank,
                'matches_played' => $opponentTeam->matches_played,
                'wins' => $opponentTeam->wins,
                'draws' => $opponentTeam->draws,
                'losses' => $opponentTeam->losses,
                'goals_for' => $opponentTeam->goals_for,
                'goals_against' => $opponentTeam->goals_against,
                'points' => $opponentTeam->points,
            ],
        ]);
    }

    public function update(Request $request, OpponentTeam $opponentTeam)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'rank' => 'nullable|integer|min:0',
            'matches_played' => 'nullable|integer|min:0',
            'wins' => 'nullable|integer|min:0',
            'draws' => 'nullable|integer|min:0',
            'losses' => 'nullable|integer|min:0',
            'goals_for' => 'nullable|integer|min:0',
            'goals_against' => 'nullable|integer|min:0',
            'points' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($opponentTeam->logo) {
                Storage::disk('public')->delete($opponentTeam->logo);
            }
            $validated['logo'] = $request->file('logo')->store('opponent-teams', 'public');
        }

        $opponentTeam->update($validated);

        return redirect()->route('admin.opponent-teams.index')
            ->with('success', 'Équipe adverse mise à jour avec succès');
    }

    public function destroy(OpponentTeam $opponentTeam)
    {
        // Delete logo if exists
        if ($opponentTeam->logo) {
            Storage::disk('public')->delete($opponentTeam->logo);
        }

        $opponentTeam->delete();

        return redirect()->route('admin.opponent-teams.index')
            ->with('success', 'Équipe adverse supprimée avec succès');
    }

    public function updateRank(Request $request, OpponentTeam $opponentTeam)
    {
        $validated = $request->validate([
            'rank' => 'required|integer|min:0',
        ]);

        $opponentTeam->update($validated);

        return redirect()->back()->with('success', 'Rang mis à jour avec succès');
    }
}
