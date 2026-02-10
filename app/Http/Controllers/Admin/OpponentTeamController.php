<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OpponentTeam;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OpponentTeamController extends Controller
{
    public function index(Request $request)
    {
        $activeSeason = Season::where('is_active', true)->first();
        $seasons = Season::orderBy('start_date', 'desc')->get()->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->name,
        ]);
        $categories = ['Senior', 'U17', 'U15', 'U13'];

        $opponentTeams = OpponentTeam::orderBy('name')->get()->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->name,
                'category' => $team->category,
                'logo' => $team->logo,
                'short_code' => $this->shortCode($team->name),
            ];
        });

        return Inertia::render('admin/opponent-teams/index', [
            'teams' => $opponentTeams->toArray(),
            'activeSeason' => $activeSeason ? ['id' => $activeSeason->id, 'name' => $activeSeason->name] : null,
            'seasons' => $seasons,
            'categories' => $categories,
        ]);
    }

    private function shortCode(string $name): string
    {
        $words = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY);
        if (count($words) >= 2) {
            return strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1));
        }
        return strtoupper(mb_substr($name, 0, 2));
    }

    public function create()
    {
        return Inertia::render('admin/opponent-teams/create');
    }

    public function store(Request $request)
    {
        $cats = $request->input('categories');
        if (is_string($cats)) {
            $request->merge(['categories' => json_decode($cats, true) ?? []]);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'categories' => 'nullable|array',
            'categories.*' => 'string|in:U13,U15,U17,Senior',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cats = $validated['categories'] ?? [];
        $validated['category'] = is_array($cats) ? array_values($cats) : ($cats ? [$cats] : []);
        unset($validated['categories']);

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
                'category' => $opponentTeam->category,
                'logo' => $opponentTeam->logo,
            ],
        ]);
    }

    public function update(Request $request, OpponentTeam $opponentTeam)
    {
        $cats = $request->input('categories');
        if (is_string($cats)) {
            $request->merge(['categories' => json_decode($cats, true) ?? []]);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'categories' => 'nullable|array',
            'categories.*' => 'string|in:U13,U15,U17,Senior',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cats = $validated['categories'] ?? [];
        $validated['category'] = is_array($cats) ? array_values($cats) : ($cats ? [$cats] : []);
        unset($validated['categories']);

        if ($request->hasFile('logo')) {
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
