<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\Team;
use App\Models\OpponentTeam;
use App\Models\Season;
use App\Models\Player;
use App\Models\MatchEvent;
use App\Models\MatchLineup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatchController extends Controller
{
    public function index(Request $request)
    {
        $query = GameMatch::with(['team', 'opponentTeam', 'competition']);

        // Filter by season (through team)
        if ($request->season_id) {
            $query->whereHas('team', function($q) use ($request) {
                $q->where('season_id', $request->season_id);
            });
        }

        // Filter by category
        if ($request->category) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $matches = $query->orderBy('scheduled_at', 'desc')
            ->paginate(15)
            ->through(function ($match) {
                return [
                    'id' => $match->id,
                    'team' => $match->team ? [
                        'id' => $match->team->id,
                        'name' => $match->team->name,
                        'category' => $match->team->category,
                    ] : null,
                    'opponent' => $match->opponent,
                    'opponent_team' => $match->opponentTeam ? [
                        'id' => $match->opponentTeam->id,
                        'name' => $match->opponentTeam->name,
                        'logo' => $match->opponentTeam->logo,
                    ] : null,
                    'category' => $match->category,
                    'scheduled_at' => $match->scheduled_at?->format('Y-m-d H:i'),
                    'venue' => $match->venue,
                    'type' => $match->type,
                    'home_score' => $match->home_score,
                    'away_score' => $match->away_score,
                    'status' => $match->status,
                ];
            });

        $seasons = Season::where('is_active', true)
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(fn($s) => ['id' => $s->id, 'name' => $s->name]);

        return Inertia::render('admin/matches/index', [
            'matches' => $matches,
            'seasons' => $seasons,
        ]);
    }

    public function create()
    {
        // Get active season
        $activeSeason = Season::where('is_active', true)->first();
        
        $teams = Team::when($activeSeason, function($q) use ($activeSeason) {
                $q->where('season_id', $activeSeason->id);
            })
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'category' => $t->category,
            ]);

        $opponentTeams = OpponentTeam::orderBy('name')->get()
            ->map(fn($ot) => [
                'id' => $ot->id,
                'name' => $ot->name,
                'logo' => $ot->logo,
            ]);

        return Inertia::render('admin/matches/create', [
            'teams' => $teams,
            'opponentTeams' => $opponentTeams,
            'activeSeason' => $activeSeason ? ['id' => $activeSeason->id, 'name' => $activeSeason->name] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'opponent_team_id' => 'nullable|exists:opponent_teams,id',
            'opponent' => 'nullable|string|max:255',
            'category' => 'required|in:U13,U15,U17,Senior',
            'scheduled_at' => 'required|date',
            'venue' => 'required|string|max:255',
            'type' => 'required|in:domicile,exterieur',
        ]);

        // If no opponent_team_id, opponent string is required
        if (!$validated['opponent_team_id'] && !$validated['opponent']) {
            return back()->withErrors(['opponent' => 'Vous devez sélectionner une équipe adverse ou saisir un nom.']);
        }

        GameMatch::create($validated);

        return redirect()->route('admin.matches.index')
            ->with('success', 'Match programmé avec succès');
    }

    public function show(GameMatch $match)
    {
        $match->load([
            'team.players',
            'opponentTeam',
            'events.player',
            'lineups.player',
            'convoctions',
        ]);

        // Get team players for lineup
        $teamPlayers = $match->team ? $match->team->players()->get()->map(function($p) {
            return [
                'id' => $p->id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'position' => $p->position,
                'jersey_number' => $p->jersey_number,
            ];
        }) : collect();

        // Get existing lineup
        $existingLineup = $match->lineups->map(function($lineup) {
            return [
                'player_id' => $lineup->player_id,
                'position' => $lineup->position,
                'jersey_number' => $lineup->jersey_number,
                'starting_position' => $lineup->starting_position,
            ];
        });

        return Inertia::render('admin/matches/show', [
            'match' => [
                'id' => $match->id,
                'team' => $match->team ? [
                    'id' => $match->team->id,
                    'name' => $match->team->name,
                    'category' => $match->team->category,
                ] : null,
                'opponent' => $match->opponent,
                'opponent_team' => $match->opponentTeam ? [
                    'id' => $match->opponentTeam->id,
                    'name' => $match->opponentTeam->name,
                    'logo' => $match->opponentTeam->logo,
                ] : null,
                'category' => $match->category,
                'scheduled_at' => $match->scheduled_at?->format('Y-m-d H:i'),
                'venue' => $match->venue,
                'type' => $match->type,
                'home_score' => $match->home_score,
                'away_score' => $match->away_score,
                'status' => $match->status,
                'match_report' => $match->match_report,
                'coach_notes' => $match->coach_notes,
                'events' => $match->events->map(function($e) {
                    return [
                        'id' => $e->id,
                        'type' => $e->type,
                        'minute' => $e->minute,
                        'description' => $e->description,
                        'player' => $e->player ? [
                            'id' => $e->player->id,
                            'first_name' => $e->player->first_name,
                            'last_name' => $e->player->last_name,
                        ] : null,
                    ];
                }),
            ],
            'teamPlayers' => $teamPlayers,
            'existingLineup' => $existingLineup,
        ]);
    }

    public function edit(GameMatch $match)
    {
        $activeSeason = Season::where('is_active', true)->first();
        
        $teams = Team::when($activeSeason, function($q) use ($activeSeason) {
                $q->where('season_id', $activeSeason->id);
            })
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'category' => $t->category,
            ]);

        $opponentTeams = OpponentTeam::orderBy('name')->get()
            ->map(fn($ot) => [
                'id' => $ot->id,
                'name' => $ot->name,
                'logo' => $ot->logo,
            ]);

        return Inertia::render('admin/matches/edit', [
            'match' => [
                'id' => $match->id,
                'team_id' => $match->team_id,
                'opponent_team_id' => $match->opponent_team_id,
                'opponent' => $match->opponent,
                'category' => $match->category,
                'scheduled_at' => $match->scheduled_at?->format('Y-m-d\\TH:i'),
                'venue' => $match->venue,
                'type' => $match->type,
                'status' => $match->status,
            ],
            'teams' => $teams,
            'opponentTeams' => $opponentTeams,
        ]);
    }

    public function update(Request $request, GameMatch $match)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'opponent_team_id' => 'nullable|exists:opponent_teams,id',
            'opponent' => 'nullable|string|max:255',
            'category' => 'required|in:U13,U15,U17,Senior',
            'scheduled_at' => 'required|date',
            'venue' => 'required|string|max:255',
            'type' => 'required|in:domicile,exterieur',
            'status' => 'required|in:scheduled,live,finished,postponed,cancelled',
            'home_score' => 'nullable|integer|min:0',
            'away_score' => 'nullable|integer|min:0',
            'match_report' => 'nullable|string',
            'coach_notes' => 'nullable|string',
        ]);

        $match->update($validated);

        return redirect()->route('admin.matches.index')
            ->with('success', 'Match mis à jour avec succès');
    }

    public function destroy(GameMatch $match)
    {
        $match->delete();

        return redirect()->route('admin.matches.index')
            ->with('success', 'Match supprimé avec succès');
    }

    public function updateLineup(Request $request, GameMatch $match)
    {
        $validated = $request->validate([
            'lineup' => 'required|array',
            'lineup.*.player_id' => 'required|exists:players,id',
            'lineup.*.position' => 'required|in:titulaire,remplacante',
            'lineup.*.jersey_number' => 'nullable|integer',
            'lineup.*.starting_position' => 'nullable|integer|min:1|max:11',
        ]);

        // Delete existing lineup
        $match->lineups()->delete();

        // Create new lineup
        foreach ($validated['lineup'] as $lineupData) {
            MatchLineup::create([
                'match_id' => $match->id,
                'player_id' => $lineupData['player_id'],
                'position' => $lineupData['position'],
                'jersey_number' => $lineupData['jersey_number'] ?? null,
                'starting_position' => $lineupData['starting_position'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Composition mise à jour avec succès');
    }

    public function addEvent(Request $request, GameMatch $match)
    {
        $validated = $request->validate([
            'type' => 'required|in:goal,yellow_card,red_card,substitution,injury,penalty,missed_penalty',
            'player_id' => 'nullable|exists:players,id',
            'minute' => 'required|integer|min:1|max:120',
            'description' => 'nullable|string',
            'substituted_player_id' => 'nullable|exists:players,id',
        ]);

        MatchEvent::create([
            'match_id' => $match->id,
            ...$validated,
        ]);

        return redirect()->back()->with('success', 'Événement ajouté avec succès');
    }
}
