<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Season;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $activeSeason = Season::where('is_active', true)->first();

        $query = Team::with(['season', 'staff'])
            ->orderBy('category')
            ->orderBy('name');

        if ($request->filled('season_id')) {
            $query->where('season_id', $request->season_id);
        }

        $teams = $query->paginate(50)->through(function ($team) {
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

            return [
                'id' => $team->id,
                'name' => $team->name,
                'category' => $team->category,
                'division' => $team->division,
                'image' => $team->image,
                'season' => $team->season ? [
                    'id' => $team->season->id,
                    'name' => $team->season->name,
                    'is_active' => $team->season->is_active,
                ] : null,
                'is_active' => $team->is_active,
                'players_count' => $team->players()->count(),
                'description' => $team->description,
                'coach_name' => $coachName,
            ];
        });

        $seasons = Season::orderBy('start_date', 'desc')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'is_active' => (bool) $s->is_active,
            ];
        });

        $categories = Team::distinct()->pluck('category')->filter()->values()->toArray();

        return Inertia::render('admin/teams/index', [
            'teams' => $teams,
            'seasons' => $seasons,
            'activeSeason' => $activeSeason ? [
                'id' => $activeSeason->id,
                'name' => $activeSeason->name,
            ] : null,
            'categories' => $categories,
            'filters' => [
                'season_id' => $request->season_id,
            ],
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
        $team->load(['season', 'players', 'staff', 'trainings', 'matches' => fn ($q) => $q->with('opponentTeam')->orderBy('scheduled_at', 'desc')]);

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

        // All active players for "Add New Player" dialog: not yet in this team (can be in other teams)
        $teamPlayerIds = $team->players()->pluck('players.id')->toArray();
        $availablePlayers = \App\Models\Player::with(['team', 'teams'])
            ->where('is_active', true)
            ->whereNotIn('id', $teamPlayerIds)
            ->orderBy('last_name')
            ->get()
            ->map(function ($p) {
                $teamNames = $p->teams->pluck('name')->toArray();
                return [
                    'id' => $p->id,
                    'first_name' => $p->first_name,
                    'last_name' => $p->last_name,
                    'position' => $p->position,
                    'team_id' => $p->team_id,
                    'team_name' => $p->team ? $p->team->name : null,
                    'teams' => $teamNames,
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
                        'role_label' => Staff::ROLES[$s->pivot->role] ?? $s->pivot->role,
                    ];
                }),
                'former_players' => [], // Reserved for future (e.g. left_team_at, status)
                'trialists' => [], // Reserved for future
                'matches' => $team->matches->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'opponent' => $m->opponent,
                        'opponent_team' => $m->opponentTeam ? ['id' => $m->opponentTeam->id, 'name' => $m->opponentTeam->name, 'logo' => $m->opponentTeam->logo] : null,
                        'scheduled_at' => $m->scheduled_at?->format('Y-m-d H:i'),
                        'venue' => $m->venue,
                        'type' => $m->type,
                        'status' => $m->status,
                        'home_score' => $m->home_score,
                        'away_score' => $m->away_score,
                        'category' => $m->category,
                    ];
                })->values()->all(),
            ],
            'availablePlayers' => $availablePlayers,
            'availableStaff' => Staff::with('teams')->orderBy('last_name')->get()->map(fn($s) => [
                'id' => $s->id,
                'first_name' => $s->first_name,
                'last_name' => $s->last_name,
                'role' => $s->role,
                'role_label' => Staff::ROLES[$s->role] ?? $s->role,
                'already_in_team' => $team->staff->contains('id', $s->id),
            ])->values()->all(),
            'staffRoleOptions' => Staff::ROLES,
        ]);
    }

    public function assignStaff(Request $request, Team $team)
    {
        $validated = $request->validate([
            'staff_id' => 'required|uuid|exists:staff,id',
            'role' => 'required|string|in:' . implode(',', Staff::ROLE_KEYS),
        ]);

        $staff = Staff::findOrFail($validated['staff_id']);
        if ($team->staff()->where('staff.id', $staff->id)->exists()) {
            return redirect()->back()->with('error', 'Ce membre du staff est déjà affecté à cette équipe.');
        }

        $team->staff()->attach($staff->id, [
            'role' => $validated['role'],
            'is_primary' => false,
        ]);

        return redirect()->back()->with('success', 'Staff affecté à l\'équipe.');
    }

    public function removeStaff(Team $team, $staffId)
    {
        if (!$team->staff()->where('staff.id', $staffId)->exists()) {
            return redirect()->back()->with('error', 'Ce membre n\'est pas affecté à cette équipe.');
        }
        $team->staff()->detach($staffId);
        return redirect()->back()->with('success', 'Staff retiré de l\'équipe.');
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
        if ($team->players()->where('players.id', $player->id)->exists()) {
            return redirect()->back()->with('error', 'Cette joueuse est déjà dans cette équipe.');
        }

        $isPrimary = $player->team_id === null;
        $team->players()->attach($player->id, ['is_primary' => $isPrimary]);
        if ($isPrimary) {
            $player->update(['team_id' => $team->id]);
        }

        return redirect()->back()->with('success', 'Joueuse assignée avec succès');
    }

    public function removePlayer(Team $team, $playerId)
    {
        $player = \App\Models\Player::findOrFail($playerId);
        if (!$team->players()->where('players.id', $player->id)->exists()) {
            return redirect()->back()->with('error', 'Cette joueuse n\'appartient pas à cette équipe');
        }

        $team->players()->detach($player->id);
        if ($player->team_id === $team->id) {
            $primary = $player->teams()->wherePivot('is_primary', true)->first();
            $fallback = $player->teams()->first();
            $player->update(['team_id' => $primary?->id ?? $fallback?->id]);
        }

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
