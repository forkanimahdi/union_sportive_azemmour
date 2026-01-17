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
        // Load all teams for frontend filtering
        $teams = Team::with(['season', 'players'])
            ->orderBy('category')
            ->orderBy('name')
            ->paginate(50)
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
                    'description' => $team->description,
                ];
            });

        // Load all players for frontend filtering (same as PlayerController)
        $players = \App\Models\Player::with(['team'])
            ->orderBy('last_name')
            ->paginate(100)
            ->through(function ($player) {
                // Calculate statistics
                $appearances = $player->matchLineups()->whereHas('match', function($q) {
                    $q->where('status', 'finished');
                })->count();
                
                $goals = $player->matchEvents()->where('type', 'goal')->count();
                
                // Assists - count passes that led to goals (simplified)
                $assists = 0;
                
                // Current season stats (simplified)
                $currentSeasonAppearances = $appearances;
                $currentSeasonGoals = $goals;
                $currentSeasonAssists = $assists;
                
                $dateOfBirth = $player->date_of_birth ? $player->date_of_birth->format('Y-m-d') : null;
                
                return [
                    'id' => $player->id,
                    'first_name' => $player->first_name,
                    'last_name' => $player->last_name,
                    'photo' => $player->photo,
                    'jersey_number' => $player->jersey_number,
                    'position' => $player->position,
                    'date_of_birth' => $dateOfBirth,
                    'team' => $player->team ? [
                        'id' => $player->team->id,
                        'name' => $player->team->name,
                        'category' => $player->team->category,
                    ] : null,
                    'is_active' => $player->is_active,
                    'can_play' => $player->canPlay(),
                    'stats' => [
                        'appearances' => [
                            'total' => $appearances,
                            'season' => $currentSeasonAppearances,
                        ],
                        'goals' => [
                            'total' => $goals,
                            'season' => $currentSeasonGoals,
                        ],
                        'assists' => [
                            'total' => $assists,
                            'season' => $currentSeasonAssists,
                        ],
                    ],
                ];
            });

        $seasons = Season::orderBy('start_date', 'desc')->get()->map(function($s) {
            return ['id' => $s->id, 'name' => $s->name];
        });

        // Get unique categories from teams
        $categories = Team::distinct()->pluck('category')->filter()->values()->toArray();

        return Inertia::render('admin/teams/index', [
            'teams' => $teams,
            'players' => $players,
            'seasons' => $seasons,
            'categories' => $categories,
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
        
        // Get available players (not assigned to any team or assigned to this team)
        $availablePlayers = \App\Models\Player::where(function($query) use ($team) {
            $query->whereNull('team_id')
                  ->orWhere('team_id', $team->id);
        })
        ->where('is_active', true)
        ->orderBy('last_name')
        ->get()
        ->map(function($p) {
            return [
                'id' => $p->id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'position' => $p->position,
            ];
        });
        
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
                'players' => $team->players->map(function($p) {
                    return [
                        'id' => $p->id,
                        'first_name' => $p->first_name,
                        'last_name' => $p->last_name,
                        'position' => $p->position,
                    ];
                }),
                'staff' => $team->staff->map(function($s) {
                    return [
                        'id' => $s->id,
                        'first_name' => $s->first_name,
                        'last_name' => $s->last_name,
                        'role' => $s->pivot->role,
                    ];
                }),
            ],
            'availablePlayers' => $availablePlayers,
        ]);
    }

    public function assignPlayer(Request $request, Team $team)
    {
        $validated = $request->validate([
            'player_id' => 'required|exists:players,id',
        ]);

        $player = \App\Models\Player::findOrFail($validated['player_id']);
        $player->team_id = $team->id;
        $player->save();

        return redirect()->back()->with('success', 'Joueuse assignée avec succès');
    }

    public function removePlayer(Team $team, $playerId)
    {
        $player = \App\Models\Player::findOrFail($playerId);
        
        if ($player->team_id !== $team->id) {
            return redirect()->back()->with('error', 'Cette joueuse n\'appartient pas à cette équipe');
        }

        $player->team_id = null;
        $player->save();

        return redirect()->back()->with('success', 'Joueuse retirée de l\'équipe avec succès');
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
