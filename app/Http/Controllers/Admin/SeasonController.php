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
        // Load all seasons for frontend filtering
        $seasons = Season::query()
            ->withCount(['teams'])
            ->orderBy('start_date', 'desc')
            ->paginate(15)
            ->through(function ($season) {
                $playersCount = $season->teams()->withCount('players')->get()->sum('players_count');
                return [
                    'id' => $season->id,
                    'name' => $season->name,
                    'start_date' => $season->start_date->format('Y-m-d'),
                    'end_date' => $season->end_date->format('Y-m-d'),
                    'is_active' => $season->is_active,
                    'description' => $season->description,
                    'teams_count' => $season->teams_count,
                    'players_count' => (int) $playersCount,
                ];
            });

        return Inertia::render('admin/seasons/index', [
            'seasons' => $seasons,
            'filters' => $request->only(['search', 'is_active']),
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
        $season->load([
            'teams.staff',
            'teams.players.matchEvents' => function ($query) {
                $query->whereIn('type', ['goal', 'penalty']);
            },
            'teams.matches.events',
            'teams.trainings',
            'competitions.matches',
        ]);

        // Get all matches for calendar
        $allMatches = $season->teams->flatMap->matches->sortBy('scheduled_at');
        
        // Get all trainings for calendar
        $allTrainings = $season->teams->flatMap->trainings->sortBy('scheduled_at');

        // Calculate standings/rankings
        $standings = $season->teams->map(function ($team) {
            $matches = $team->matches()->where('status', 'finished')->get();
            $wins = $matches->filter(function($m) {
                if ($m->type === 'domicile') {
                    return $m->home_score > $m->away_score;
                }
                return $m->away_score > $m->home_score;
            })->count();
            
            $draws = $matches->filter(function($m) {
                return $m->home_score === $m->away_score;
            })->count();
            $losses = $matches->count() - $wins - $draws;
            $goalsFor = $matches->sum(function($m) {
                return $m->type === 'domicile' ? $m->home_score : $m->away_score;
            });
            $goalsAgainst = $matches->sum(function($m) {
                return $m->type === 'domicile' ? $m->away_score : $m->home_score;
            });
            
            return [
                'id' => $team->id,
                'name' => $team->name,
                'category' => $team->category,
                'played' => $matches->count(),
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'goals_for' => $goalsFor,
                'goals_against' => $goalsAgainst,
                'goal_difference' => $goalsFor - $goalsAgainst,
                'points' => ($wins * 3) + $draws,
            ];
        })->sortByDesc('points')->sortByDesc(function($t) {
            return $t['goal_difference'];
        })->values();

        // Calculate statistics - top scorers (include penalty goals, exclude own goals)
        $topScorers = $season->teams->flatMap->players->map(function ($player) {
            $goals = $player->matchEvents()
                ->whereIn('type', ['goal', 'penalty'])
                ->whereHas('match', function($q) {
                    $q->where('status', 'finished');
                })
                ->count();
            return [
                'id' => $player->id,
                'name' => $player->first_name . ' ' . $player->last_name,
                'team' => $player->team->name,
                'category' => $player->team->category,
                'goals' => $goals,
            ];
        })->filter(function($p) {
            return $p['goals'] > 0;
        })->sortByDesc('goals')->take(10)->values();

        // Get categories
        $categories = $season->teams->pluck('category')->unique()->sort()->values();

        // Financial summary (mock/placeholder data - to be implemented)
        $financialSummary = [
            'total_registered' => $season->teams->sum(function($t) {
                return $t->players()->count();
            }),
            'fees_collected' => 0, // Placeholder
            'fees_pending' => 0, // Placeholder
            'total_expected' => 0, // Placeholder
        ];
        
        return Inertia::render('admin/seasons/show', [
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'start_date' => $season->start_date->format('Y-m-d'),
                'end_date' => $season->end_date->format('Y-m-d'),
                'is_active' => $season->is_active,
                'description' => $season->description,
                'teams' => $season->teams->map(function($team) {
                    $playersCount = $team->players()->count();
                    $primaryCoach = $team->staff()
                        ->wherePivotIn('role', ['head_coach', 'assistant_coach'])
                        ->wherePivot('is_primary', true)
                        ->first();
                    if (!$primaryCoach) {
                        $primaryCoach = $team->staff()->wherePivotIn('role', ['head_coach', 'assistant_coach'])->first();
                    }
                    if (!$primaryCoach) {
                        $primaryCoach = $team->staff()->first();
                    }
                    $coachName = $primaryCoach ? $primaryCoach->fullName() : null;
                    $minRoster = in_array($team->category, ['U17', 'Senior']) ? 14 : 12;
                    $rosterComplete = $playersCount >= $minRoster;
                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'category' => $team->category,
                        'division' => $team->division,
                        'description' => $team->description,
                        'image' => $team->image,
                        'is_active' => $team->is_active,
                        'players_count' => $playersCount,
                        'coach_name' => $coachName,
                        'roster_complete' => $rosterComplete,
                    ];
                })->values(),
                'competitions' => $season->competitions->map(function($comp) {
                    return [
                    'id' => $comp->id,
                    'name' => $comp->name,
                    'type' => $comp->type,
                    ];
                }),
                'categories' => $categories,
                'matches' => $allMatches->map(function($match) {
                    return [
                        'id' => $match->id,
                        'team_name' => $match->team->name,
                        'category' => $match->team->category,
                        'opponent' => $match->opponent,
                        'scheduled_at' => $match->scheduled_at->format('Y-m-d H:i'),
                        'venue' => $match->venue,
                        'type' => $match->type,
                        'status' => $match->status,
                        'home_score' => $match->home_score,
                        'away_score' => $match->away_score,
                        'competition' => $match->competition ? $match->competition->name : null,
                    ];
                })->values(),
                'trainings' => $allTrainings->map(function($training) {
                    return [
                        'id' => $training->id,
                        'team_name' => $training->team->name,
                        'category' => $training->team->category,
                        'scheduled_at' => $training->scheduled_at->format('Y-m-d H:i'),
                        'location' => $training->location,
                        'status' => $training->status,
                    ];
                })->values(),
                'standings' => $standings,
                'top_scorers' => $topScorers,
                'financial_summary' => $financialSummary,
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

    public function duplicate(Season $season)
    {
        $newSeason = $season->replicate();
        $newSeason->name = $season->name . ' (Copie)';
        $newSeason->is_active = false;
        $newSeason->save();

        // Duplicate teams (optional - can be removed if not needed)
        foreach ($season->teams as $team) {
            $newTeam = $team->replicate();
            $newTeam->season_id = $newSeason->id;
            $newTeam->save();
        }

        return redirect()->route('admin.seasons.show', $newSeason)
            ->with('success', 'Saison dupliquée avec succès');
    }

    public function export(Season $season)
    {
        // Placeholder for export functionality
        // This would typically generate an Excel or PDF file
        return response()->json([
            'message' => 'Export functionality will be implemented soon',
            'season_id' => $season->id,
        ]);
    }

    public function bulkMessage(Season $season)
    {
        // Placeholder for bulk messaging
        // This would typically render a page to compose and send messages
        return Inertia::render('admin/seasons/bulk-message', [
            'season' => [
                'id' => $season->id,
                'name' => $season->name,
                'teams_count' => $season->teams()->count(),
            ],
        ]);
    }
}
