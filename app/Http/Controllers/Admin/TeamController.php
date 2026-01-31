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
                    'division' => $team->division,
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
        $seasons = Season::orderBy('start_date', 'desc')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ]);

        return Inertia::render('admin/teams/create', [
            'seasons' => $seasons,
        ]);
    }

    public function createForSeason(Season $season)
    {
        $seasons = Season::orderBy('start_date', 'desc')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ]);

        return Inertia::render('admin/teams/create', [
            'seasons' => $seasons,
            'initialSeasonId' => $season->id,
            'returnToSeasonId' => $season->id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'season_id' => 'required|exists:seasons,id',
            'category' => 'required|in:U13,U15,U17,Senior',
            'division' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $team = Team::create($validated);

        if ($request->filled('return_to_season_id')) {
            return redirect()->route('admin.seasons.show', $request->return_to_season_id)
                ->with('success', 'Équipe créée avec succès');
        }

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe créée avec succès');
    }

    public function show(Team $team)
    {
        $team->load(['season', 'players', 'staff', 'trainings', 'matches']);

        $players = $team->players->map(function ($p) {
            $canPlay = $p->canPlay();
            $blockReason = $p->getFitToPlayBlockReason();
            $age = $p->date_of_birth ? now()->diffInYears($p->date_of_birth) : null;
            return [
                'id' => $p->id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'position' => $p->position,
                'photo' => $p->photo,
                'jersey_number' => $p->jersey_number,
                'date_of_birth' => $p->date_of_birth?->format('Y-m-d'),
                'can_play' => $canPlay,
                'block_reason' => $blockReason,
                'has_valid_medical' => $p->hasValidMedicalCertificate(),
                'age' => $age,
            ];
        });

        $matchReady = $players->where('can_play', true)->count();
        $actionRequired = $players->where('can_play', false)->count();
        $ages = $players->pluck('age')->filter();
        $avgAge = $ages->isNotEmpty() ? round($ages->avg(), 1) : null;

        $stats = [
            'total_players' => $players->count(),
            'match_ready' => $matchReady,
            'action_required' => $actionRequired,
            'avg_age' => $avgAge,
        ];

        // Available players for "Add New Player" (not in this team, active)
        $availablePlayers = \App\Models\Player::where(function ($query) use ($team) {
            $query->whereNull('team_id')->orWhere('team_id', $team->id);
        })
            ->where('is_active', true)
            ->orderBy('last_name')
            ->get()
            ->map(function ($p) {
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
                'division' => $team->division,
                'description' => $team->description,
                'is_active' => $team->is_active,
                'season' => $team->season ? [
                    'id' => $team->season->id,
                    'name' => $team->season->name,
                ] : null,
                'players' => $players->values()->all(),
                'stats' => $stats,
                'staff' => $team->staff->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'first_name' => $s->first_name,
                        'last_name' => $s->last_name,
                        'role' => $s->pivot->role,
                    ];
                }),
                'former_players' => [], // Reserved for future (e.g. left_team_at, status)
                'trialists' => [], // Reserved for future
            ],
            'availablePlayers' => $availablePlayers,
        ]);
    }

    public function exportRoster(Team $team)
    {
        $team->load(['players']);
        $filename = 'effectif-' . \Illuminate\Support\Str::slug($team->name) . '-' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        $callback = function () use ($team) {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, ['Nom', 'Prénom', 'Poste', 'Numéro', 'Âge', 'Prête à jouer'], ';');
            foreach ($team->players as $p) {
                $age = $p->date_of_birth ? now()->diffInYears($p->date_of_birth) : '';
                fputcsv($stream, [
                    $p->last_name,
                    $p->first_name,
                    $p->position ?? '',
                    $p->jersey_number ?? '',
                    $age,
                    $p->canPlay() ? 'Oui' : 'Non',
                ], ';');
            }
            fclose($stream);
        };
        return response()->stream($callback, 200, $headers);
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
                'division' => $team->division,
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
            'division' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $team->update($validated);

        if ($request->filled('return_to_season_id')) {
            return redirect()->route('admin.seasons.show', $request->return_to_season_id)
                ->with('success', 'Équipe mise à jour avec succès');
        }

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe mise à jour avec succès');
    }

    public function destroy(Request $request, Team $team)
    {
        $team->delete();

        $returnToSeasonId = $request->query('return_to_season_id') ?? $request->input('return_to_season_id');

        if ($returnToSeasonId) {
            return redirect()->route('admin.seasons.show', $returnToSeasonId)
                ->with('success', 'Équipe supprimée avec succès');
        }

        return redirect()->route('admin.teams.index')
            ->with('success', 'Équipe supprimée avec succès');
    }
}
