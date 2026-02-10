<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $activeSeason = Season::where('is_active', true)->first();

        // Senior matches from active season only
        $matches = collect();
        if ($activeSeason) {
            $matches = GameMatch::with(['team', 'opponentTeam'])
                ->whereHas('team', function ($q) use ($activeSeason) {
                    $q->where('season_id', $activeSeason->id)->where('category', 'Senior');
                })
                ->where('category', 'Senior')
                ->whereIn('status', ['scheduled', 'live', 'finished'])
                ->orderBy('scheduled_at')
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'home_team' => $m->type === 'domicile' ? ($m->team?->name ?? 'USA') : ($m->opponentTeam?->name ?? $m->opponent ?? 'Adversaire'),
                        'away_team' => $m->type === 'exterieur' ? ($m->team?->name ?? 'USA') : ($m->opponentTeam?->name ?? $m->opponent ?? 'Adversaire'),
                        'home_score' => $m->home_score,
                        'away_score' => $m->away_score,
                        'scheduled_at' => $m->scheduled_at?->format('Y-m-d H:i'),
                        'venue' => $m->venue,
                        'type' => $m->type,
                        'status' => $m->status,
                        'opponent_name' => $m->opponentTeam?->name ?? $m->opponent,
                    ];
                });
        }

        // Senior squad players (active season, Senior team only)
        $players = collect();
        if ($activeSeason) {
            $seniorTeam = Team::where('season_id', $activeSeason->id)
                ->where('category', 'Senior')
                ->where('is_active', true)
                ->first();
            if ($seniorTeam) {
                $players = $seniorTeam->players()
                    ->where('is_active', true)
                    ->orderBy('jersey_number')
                    ->orderBy('last_name')
                    ->get()
                    ->map(function ($p) {
                        return [
                            'id' => $p->id,
                            'first_name' => $p->first_name,
                            'last_name' => $p->last_name,
                            'position' => $p->position,
                            'jersey_number' => $p->jersey_number,
                            'photo' => $p->photo,
                        ];
                    });
            }
        }

        return Inertia::render('welcome', [
            'matches' => $matches->values()->all(),
            'players' => $players->values()->all(),
            'activeSeason' => $activeSeason ? ['id' => $activeSeason->id, 'name' => $activeSeason->name] : null,
        ]);
    }
}
