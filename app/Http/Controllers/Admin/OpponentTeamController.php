<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OpponentTeam;
use App\Models\Team;
use App\Models\GameMatch;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OpponentTeamController extends Controller
{
    public function index()
    {
        // Get active season
        $activeSeason = Season::where('is_active', true)->first();
        
        // Get all opponent teams
        $opponentTeams = OpponentTeam::get()
            ->map(function($team) use ($activeSeason) {
                // Calculate stats from finished matches
                $matches = GameMatch::where('opponent_team_id', $team->id)
                    ->where('status', 'finished')
                    ->when($activeSeason, function($q) use ($activeSeason) {
                        $q->whereHas('team', function($tq) use ($activeSeason) {
                            $tq->where('season_id', $activeSeason->id);
                        });
                    })
                    ->get();
                
                $wins = 0;
                $draws = 0;
                $losses = 0;
                $goalsFor = 0;
                $goalsAgainst = 0;
                
                foreach ($matches as $match) {
                    // Opponent team is away, our team is home
                    $opponentScore = $match->away_score ?? 0;
                    $ourScore = $match->home_score ?? 0;
                    
                    $goalsFor += $opponentScore;
                    $goalsAgainst += $ourScore;
                    
                    if ($opponentScore > $ourScore) {
                        $wins++;
                    } elseif ($opponentScore === $ourScore) {
                        $draws++;
                    } else {
                        $losses++;
                    }
                }
                
                $matchesPlayed = $matches->count();
                $points = ($wins * 3) + $draws;
                
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => $team->logo,
                    'rank' => $team->rank,
                    'matches_played' => $matchesPlayed ?: ($team->matches_played ?? 0),
                    'wins' => $wins ?: ($team->wins ?? 0),
                    'draws' => $draws ?: ($team->draws ?? 0),
                    'losses' => $losses ?: ($team->losses ?? 0),
                    'goals_for' => $goalsFor ?: ($team->goals_for ?? 0),
                    'goals_against' => $goalsAgainst ?: ($team->goals_against ?? 0),
                    'goal_difference' => ($goalsFor - $goalsAgainst) ?: ($team->goal_difference ?? 0),
                    'points' => $points ?: ($team->points ?? 0),
                    'is_opponent' => true,
                ];
            });

        // Get our teams (active season, grouped by category)
        $ourTeams = [];
        if ($activeSeason) {
            $teams = Team::where('season_id', $activeSeason->id)
                ->where('is_active', true)
                ->with('matches')
                ->get();
            
            foreach ($teams as $team) {
                // Calculate stats from finished matches
                $matches = GameMatch::where('team_id', $team->id)
                    ->where('status', 'finished')
                    ->get();
                
                $wins = 0;
                $draws = 0;
                $losses = 0;
                $goalsFor = 0;
                $goalsAgainst = 0;
                
                foreach ($matches as $match) {
                    if ($match->type === 'domicile') {
                        $ourScore = $match->home_score ?? 0;
                        $opponentScore = $match->away_score ?? 0;
                    } else {
                        $ourScore = $match->away_score ?? 0;
                        $opponentScore = $match->home_score ?? 0;
                    }
                    
                    $goalsFor += $ourScore;
                    $goalsAgainst += $opponentScore;
                    
                    if ($ourScore > $opponentScore) {
                        $wins++;
                    } elseif ($ourScore === $opponentScore) {
                        $draws++;
                    } else {
                        $losses++;
                    }
                }
                
                $matchesPlayed = $matches->count();
                $points = ($wins * 3) + $draws;
                
                $ourTeams[] = [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo' => null, // Team logo if available
                    'rank' => null,
                    'category' => $team->category,
                    'matches_played' => $matchesPlayed,
                    'wins' => $wins,
                    'draws' => $draws,
                    'losses' => $losses,
                    'goals_for' => $goalsFor,
                    'goals_against' => $goalsAgainst,
                    'goal_difference' => $goalsFor - $goalsAgainst,
                    'points' => $points,
                    'is_opponent' => false,
                ];
            }
        }

        // Combine and prepare all teams
        $allTeams = array_merge($opponentTeams->toArray(), $ourTeams);

        return Inertia::render('admin/opponent-teams/index', [
            'teams' => $allTeams,
            'activeSeason' => $activeSeason ? ['id' => $activeSeason->id, 'name' => $activeSeason->name] : null,
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
