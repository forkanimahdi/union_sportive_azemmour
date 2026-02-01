<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $query = Player::with(['team.season'])
            ->orderBy('last_name')
            ->orderBy('first_name');

        if ($request->filled('season_id')) {
            $query->whereHas('team', fn($q) => $q->where('season_id', $request->season_id));
        }
        if ($request->filled('category')) {
            $query->whereHas('team', fn($q) => $q->where('category', $request->category));
        }
        if ($request->filled('status') && $request->status === 'active') {
            $query->where('is_active', true);
        }
        if ($request->filled('status') && $request->status === 'alumni') {
            $query->where('is_active', false);
        }
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('first_name', 'like', $term)
                    ->orWhere('last_name', 'like', $term);
            });
        }

        $players = $query->paginate(24)->through(function ($player) {
            $appearances = $player->matchLineups()->whereHas('match', function ($q) {
                $q->where('status', 'finished');
            })->count();
            $goals = $player->matchEvents()->where('type', 'goal')->count();
            $assists = 0;
            $canPlay = $player->canPlay();
            $isInjured = $player->isInjured();

            return [
                'id' => $player->id,
                'first_name' => $player->first_name,
                'last_name' => $player->last_name,
                'photo' => $player->photo,
                'jersey_number' => $player->jersey_number,
                'position' => $player->position,
                'date_of_birth' => $player->date_of_birth?->format('Y-m-d'),
                'team' => $player->team ? [
                    'id' => $player->team->id,
                    'name' => $player->team->name,
                    'category' => $player->team->category,
                    'season' => $player->team->season ? [
                        'id' => $player->team->season->id,
                        'name' => $player->team->season->name,
                    ] : null,
                ] : null,
                'is_active' => $player->is_active,
                'can_play' => $canPlay,
                'is_injured' => $isInjured,
                'status_label' => !$player->is_active ? 'LEFT' : ($isInjured ? 'INJURED' : 'FIT'),
                'stats' => [
                    'appearances' => ['total' => $appearances, 'season' => $appearances],
                    'goals' => ['total' => $goals, 'season' => $goals],
                    'assists' => ['total' => $assists, 'season' => $assists],
                    'clean_sheets' => 0,
                    'saves' => 0,
                ],
            ];
        });

        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
        ]);

        $seasons = Season::orderBy('start_date', 'desc')->get()->map(fn($s) => [
            'id' => $s->id,
            'name' => $s->name,
        ]);

        $categories = Team::distinct()->pluck('category')->filter()->values()->toArray();

        return Inertia::render('admin/players/index', [
            'players' => $players,
            'teams' => $teams,
            'seasons' => $seasons,
            'categories' => $categories,
            'filters' => $request->only(['season_id', 'category', 'status', 'search', 'team_id', 'position']),
        ]);
    }

    public function create()
    {
        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
        ]);

        return Inertia::render('admin/players/create', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'position' => 'nullable|in:gardien,defenseur,milieu,attaquant',
            'preferred_foot' => 'nullable|in:gauche,droit,ambidextre',
            'jersey_number' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('players/photos', 'public');
        }

        Player::create($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse créée avec succès');
    }

    public function show(Player $player)
    {
        $player->load([
            'team.season', 
            'team.players', 
            'team.matches', 
            'injuries', 
            'disciplinaryActions', 
            'imageRight',
            'matchLineups.match',
            'matchEvents.match',
        ]);

        // Calculate statistics
        $appearances = $player->matchLineups()->whereHas('match', function($q) {
            $q->where('status', 'finished');
        })->count();
        
        $goals = $player->matchEvents()->where('type', 'goal')->count();
        $assists = 0;
        $yellowCards = $player->matchEvents()->where('type', 'yellow_card')->count();
        $redCards = $player->matchEvents()->where('type', 'red_card')->count();
        $minutes = $appearances * 90; // Placeholder: no minutes_played on lineup
        
        // Get teammates
        $teammates = [];
        if ($player->team) {
            $teammates = $player->team->players()
                ->where('id', '!=', $player->id)
                ->take(10)
                ->get()
                ->map(function($p) {
                    return [
                        'id' => $p->id,
                        'first_name' => $p->first_name,
                        'last_name' => $p->last_name,
                        'photo' => $p->photo,
                        'jersey_number' => $p->jersey_number,
                        'position' => $p->position,
                    ];
                });
        }

        // Get upcoming and recent matches
        $upcomingMatch = null;
        $recentMatches = [];
        if ($player->team) {
            $upcomingMatch = $player->team->matches()
                ->where('status', 'scheduled')
                ->where('scheduled_at', '>', now())
                ->orderBy('scheduled_at')
                ->first();

            $finishedMatches = $player->team->matches()
                ->where('status', 'finished')
                ->orderBy('scheduled_at', 'desc')
                ->take(7)
                ->get();

            $recentMatches = $finishedMatches->take(5)->map(function($m) use ($player) {
                $won = false;
                if ($m->type === 'domicile') {
                    $won = $m->home_score > $m->away_score;
                } else {
                    $won = $m->away_score > $m->home_score;
                }
                $matchGoals = $player->matchEvents()->where('match_id', $m->id)->where('type', 'goal')->count();
                $matchAssists = 0;
                $scoreStr = $m->type === 'domicile'
                    ? "{$m->home_score}-{$m->away_score}"
                    : "{$m->away_score}-{$m->home_score}";
                $result = $won ? 'W' : ($m->home_score === $m->away_score ? 'D' : 'L');
                $rating = $matchGoals > 0 ? round(7 + $matchGoals * 0.5 + ($won ? 0.5 : 0), 1) : round(6.5 + ($won ? 0.5 : 0), 1);
                return [
                    'id' => $m->id,
                    'opponent' => $m->opponent,
                    'venue' => $m->type,
                    'home_score' => $m->home_score,
                    'away_score' => $m->away_score,
                    'scheduled_at' => $m->scheduled_at->format('Y-m-d H:i'),
                    'won' => $won,
                    'goals' => $matchGoals,
                    'assists' => $matchAssists,
                    'minutes' => 90,
                    'rating' => $rating,
                    'score_display' => $scoreStr,
                    'result' => $result,
                ];
            })->values()->all();

            $performanceTrend = $finishedMatches->reverse()->values()->map(function($m, $i) use ($player) {
                $matchGoals = $player->matchEvents()->where('match_id', $m->id)->where('type', 'goal')->count();
                $value = $matchGoals > 0 ? round(7 + $matchGoals * 0.3 + $i * 0.1, 1) : round(6.5 + $i * 0.1, 1);
                return [
                    'gw' => 'GW' . (18 + $i),
                    'value' => $value,
                ];
            })->all();
        } else {
            $recentMatches = [];
            $performanceTrend = [];
        }

        $dateOfBirth = $player->date_of_birth ? $player->date_of_birth->format('Y-m-d') : null;
        
        return Inertia::render('admin/players/show', [
            'player' => [
                'id' => $player->id,
                'first_name' => $player->first_name,
                'last_name' => $player->last_name,
                'photo' => $player->photo,
                'jersey_number' => $player->jersey_number,
                'position' => $player->position,
                'preferred_foot' => $player->preferred_foot,
                'date_of_birth' => $dateOfBirth,
                'email' => $player->email,
                'phone' => $player->phone,
                'address' => $player->address,
                'team' => $player->team ? [
                    'id' => $player->team->id,
                    'name' => $player->team->name,
                    'category' => $player->team->category,
                ] : null,
                'is_active' => $player->is_active,
                'can_play' => $player->canPlay(),
                'is_injured' => $player->isInjured(),
                'status_label' => !$player->is_active ? 'LEFT' : ($player->isInjured() ? 'INJURED' : 'FIT'),
                'is_minor' => $player->isMinor(),
                'stats' => [
                    'appearances' => $appearances,
                    'goals' => $goals,
                    'assists' => $assists,
                    'clean_sheets' => 0,
                    'saves' => 0,
                    'yellow_cards' => $yellowCards,
                    'red_cards' => $redCards,
                    'minutes' => $minutes,
                ],
                'form' => $recentMatches ? round(collect($recentMatches)->avg('rating') ?? 0, 1) : null,
                'performance_trend' => $performanceTrend ?? [],
                'stats_chart_data' => [
                    ['label' => 'MP', 'value' => $appearances, 'fill' => 'var(--color-primary)'],
                    ['label' => 'B', 'value' => $goals, 'fill' => 'var(--color-chart-1)'],
                    ['label' => 'PD', 'value' => $assists, 'fill' => 'var(--color-chart-2)'],
                ],
                'teammates' => $teammates,
                'upcoming_match' => $upcomingMatch ? [
                    'id' => $upcomingMatch->id,
                    'opponent' => $upcomingMatch->opponent,
                    'scheduled_at' => $upcomingMatch->scheduled_at->format('Y-m-d H:i'),
                    'venue' => $upcomingMatch->venue,
                    'type' => $upcomingMatch->type,
                ] : null,
                'recent_matches' => $recentMatches,
                'match_history' => $recentMatches,
                'medical_certificate_expiry' => $player->medical_certificate_expiry?->format('Y-m-d'),
                'license_status' => ($player->license_path && $player->license_number) ? 'active' : null,
                'media_permissions_signed_at' => $player->imageRight?->signed_date?->format('Y-m-d'),
                'injuries' => $player->injuries->map(function($i) {
                    return [
                    'id' => $i->id,
                    'type' => $i->type,
                    'status' => $i->status,
                    'fit_to_play' => $i->fit_to_play,
                    ];
                }),
                'suspensions' => $player->disciplinaryActions()->where('is_active', true)->get()->map(function($d) {
                    return [
                    'id' => $d->id,
                        'suspension_end_date' => $d->suspension_end_date ? $d->suspension_end_date->format('Y-m-d') : null,
                    ];
                }),
            ],
        ]);
    }

    public function export(Player $player)
    {
        $filename = 'joueur-' . \Illuminate\Support\Str::slug($player->first_name . '-' . $player->last_name) . '-' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        $callback = function () use ($player) {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, ['Prénom', 'Nom', 'Poste', 'Numéro', 'Équipe', 'Email', 'Téléphone', 'Date de naissance'], ';');
            fputcsv($stream, [
                $player->first_name,
                $player->last_name,
                $player->position ?? '',
                $player->jersey_number ?? '',
                $player->team?->name ?? '',
                $player->email ?? '',
                $player->phone ?? '',
                $player->date_of_birth?->format('Y-m-d') ?? '',
            ], ';');
            fclose($stream);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function edit(Player $player)
    {
        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
        ]);

        return Inertia::render('admin/players/edit', [
            'player' => [
                'id' => $player->id,
                'team_id' => $player->team_id,
                'first_name' => $player->first_name,
                'last_name' => $player->last_name,
                'date_of_birth' => $player->date_of_birth?->format('Y-m-d'),
                'position' => $player->position,
                'preferred_foot' => $player->preferred_foot,
                'jersey_number' => $player->jersey_number,
                'email' => $player->email,
                'phone' => $player->phone,
                'address' => $player->address,
                'guardian_name' => $player->guardian_name,
                'guardian_phone' => $player->guardian_phone,
                'guardian_email' => $player->guardian_email,
                'guardian_relationship' => $player->guardian_relationship,
                'photo' => $player->photo,
                'is_active' => $player->is_active,
            ],
            'teams' => $teams,
        ]);
    }

    public function update(Request $request, Player $player)
    {
        $validated = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'position' => 'nullable|in:gardien,defenseur,milieu,attaquant',
            'preferred_foot' => 'nullable|in:gauche,droit,ambidextre',
            'jersey_number' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            if ($player->photo) {
                Storage::disk('public')->delete($player->photo);
            }
            $validated['photo'] = $request->file('photo')->store('players/photos', 'public');
        }

        $player->update($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse mise à jour avec succès');
    }

    public function destroy(Player $player)
    {
        if ($player->photo) {
            Storage::disk('public')->delete($player->photo);
        }
        $player->delete();

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse supprimée avec succès');
    }
}
