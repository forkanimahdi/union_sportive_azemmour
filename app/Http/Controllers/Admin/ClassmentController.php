<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassmentController extends Controller
{
    public function index(Request $request)
    {
        // Classment shows only teams from the active season
        $season = Season::where('is_active', true)->first();

        if (!$season) {
            $season = Season::orderBy('start_date', 'desc')->first();
        }

        if (!$season) {
            return Inertia::render('admin/classment/index', [
                'activeSeason' => null,
                'standingsByCategory' => [],
                'categories' => [],
                'upcomingMatchByCategory' => [],
                'dataVerifiedAt' => null,
            ]);
        }

        $season->load(['teams.matches']);

        $standings = $season->teams->map(function ($team) {
            $matches = $team->matches()->where('status', 'finished')->get();
            $last5 = $team->matches()->where('status', 'finished')->orderBy('scheduled_at', 'desc')->take(5)->get();
            $wins = $matches->filter(function ($m) {
                if ($m->type === 'domicile') {
                    return $m->home_score > $m->away_score;
                }
                return $m->away_score > $m->home_score;
            })->count();
            $draws = $matches->filter(fn ($m) => $m->home_score === $m->away_score)->count();
            $losses = $matches->count() - $wins - $draws;
            $goalsFor = $matches->sum(fn ($m) => $m->type === 'domicile' ? $m->home_score : $m->away_score);
            $goalsAgainst = $matches->sum(fn ($m) => $m->type === 'domicile' ? $m->away_score : $m->home_score);
            $points = ($wins * 3) + $draws;

            $form = $last5->map(function ($m) use ($team) {
                $ourScore = $m->type === 'domicile' ? $m->home_score : $m->away_score;
                $theirScore = $m->type === 'domicile' ? $m->away_score : $m->home_score;
                if ($ourScore > $theirScore) return 'W';
                if ($ourScore < $theirScore) return 'L';
                return 'D';
            })->values()->all();

            return [
                'id' => $team->id,
                'name' => $team->name,
                'category' => $team->category,
                'short_code' => $this->shortCode($team->name),
                'played' => $matches->count(),
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'goals_for' => $goalsFor,
                'goals_against' => $goalsAgainst,
                'goal_difference' => $goalsFor - $goalsAgainst,
                'points' => $points,
                'form' => $form,
            ];
        });

        $standingsByCategory = $standings->groupBy('category')->map(function ($teams) {
            $sorted = $teams->sort(function ($a, $b) {
                if ($a['points'] !== $b['points']) {
                    return $b['points'] <=> $a['points'];
                }
                return $b['goal_difference'] <=> $a['goal_difference'];
            })->values();
            return $sorted->map(function ($row, $index) {
                $row['rank'] = $index + 1;
                return $row;
            })->all();
        })->all();

        $categories = $season->teams->pluck('category')->unique()->filter()->sort()->values()->all();

        // Prochain match par catégorie (adapté à chaque compétition)
        $upcomingMatchByCategory = collect($categories)->mapWithKeys(function ($cat) use ($season) {
            $teamIds = $season->teams->where('category', $cat)->pluck('id')->all();
            $match = \App\Models\GameMatch::whereIn('team_id', $teamIds)
                ->where('status', 'scheduled')
                ->whereNotNull('scheduled_at')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->with('team', 'opponentTeam')
                ->first();

            $data = null;
            if ($match) {
                $opponent = $match->opponentTeam?->name ?? $match->opponent ?? 'Adversaire';
                $data = [
                    'id' => $match->id,
                    'opponent' => $opponent,
                    'scheduled_at' => $match->scheduled_at->format('Y-m-d H:i'),
                    'venue' => $match->venue,
                    'team_name' => $match->team?->name ?? null,
                ];
            }
            return [$cat => $data];
        })->all();

        $dataVerifiedAt = now()->format('H:i');
        $lastUpdatedLabel = now()->locale('fr_FR')->translatedFormat("Aujourd'hui à H:i");

        return Inertia::render('admin/classment/index', [
            'activeSeason' => [
                'id' => $season->id,
                'name' => $season->name,
                'is_active' => $season->is_active,
            ],
            'standingsByCategory' => $standingsByCategory,
            'categories' => $categories,
            'upcomingMatchByCategory' => $upcomingMatchByCategory,
            'dataVerifiedAt' => $dataVerifiedAt,
            'lastUpdatedLabel' => $lastUpdatedLabel,
        ]);
    }

    private function shortCode(string $name): string
    {
        $words = preg_split('/\s+/', $name, -1, PREG_SPLIT_NO_EMPTY);
        if (count($words) >= 2) {
            return strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1));
        }
        return strtoupper(mb_substr($name, 0, 2));
    }
}
