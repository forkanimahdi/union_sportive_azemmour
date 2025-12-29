<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        // Load all players for frontend filtering
        $players = Player::with(['team'])
            ->orderBy('last_name')
            ->paginate(20)
            ->through(function ($player) {
                // Calculate statistics
                $appearances = $player->matchLineups()->whereHas('match', function($q) {
                    $q->where('status', 'finished');
                })->count();
                
                $goals = $player->matchEvents()->where('type', 'goal')->count();
                
                // Assists - count passes that led to goals (simplified - you may need to add assist tracking)
                $assists = 0; // Placeholder - would need assist tracking in match_events
                
                // Current season stats (if season is available)
                $currentSeasonAppearances = $appearances; // Simplified
                $currentSeasonGoals = $goals; // Simplified
                $currentSeasonAssists = $assists; // Simplified
                
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

        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
        ]);

        return Inertia::render('admin/players/index', [
            'players' => $players,
            'teams' => $teams,
            'filters' => $request->only(['team_id', 'position', 'search']),
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
        $assists = 0; // Placeholder
        
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

            $recentMatches = $player->team->matches()
                ->where('status', 'finished')
                ->orderBy('scheduled_at', 'desc')
                ->take(5)
                ->get()
                ->map(function($m) use ($player) {
                    $won = false;
                    if ($m->type === 'domicile') {
                        $won = $m->home_score > $m->away_score;
                    } else {
                        $won = $m->away_score > $m->home_score;
                    }
                    return [
                        'id' => $m->id,
                        'opponent' => $m->opponent,
                        'venue' => $m->type,
                        'home_score' => $m->home_score,
                        'away_score' => $m->away_score,
                        'scheduled_at' => $m->scheduled_at->format('Y-m-d H:i'),
                        'won' => $won,
                    ];
                });
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
                'is_minor' => $player->isMinor(),
                'stats' => [
                    'appearances' => $appearances,
                    'goals' => $goals,
                    'assists' => $assists,
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
