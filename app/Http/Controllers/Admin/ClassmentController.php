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
        $seasonId = $request->query('season_id');
        $season = $seasonId
            ? Season::find($seasonId)
            : Season::where('is_active', true)->first();

        if (!$season) {
            $season = Season::orderBy('start_date', 'desc')->first();
        }

        if (!$season) {
            return Inertia::render('admin/classment/index', [
                'activeSeason' => null,
                'seasons' => [],
                'standingsByCategory' => [],
                'categories' => [],
                'upcomingMatch' => null,
                'dataVerifiedAt' => null,
            ]);
        }

        $season->load(['teams.matches']);

        $standings = $season->teams->map(function ($team) {
            $matches = $team->matches()->where('status', 'finished')->get();
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
                'points' => ($wins * 3) + $draws,
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

        $upcomingMatch = $season->teams->flatMap->matches
            ->filter(fn ($m) => $m->status === 'scheduled' && $m->scheduled_at && $m->scheduled_at->isFuture())
            ->sortBy('scheduled_at')
            ->first();

        $dataVerifiedAt = now()->format('H:i');

        $seasons = Season::orderBy('start_date', 'desc')->get()->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'is_active' => $s->is_active,
        ]);

        return Inertia::render('admin/classment/index', [
            'activeSeason' => [
                'id' => $season->id,
                'name' => $season->name,
                'is_active' => $season->is_active,
            ],
            'seasons' => $seasons,
            'standingsByCategory' => $standingsByCategory,
            'categories' => $categories,
            'upcomingMatch' => $upcomingMatch ? [
                'id' => $upcomingMatch->id,
                'opponent' => $upcomingMatch->opponent,
                'scheduled_at' => $upcomingMatch->scheduled_at->format('Y-m-d H:i'),
                'venue' => $upcomingMatch->venue,
                'team_name' => $upcomingMatch->team->name ?? null,
            ] : null,
            'dataVerifiedAt' => $dataVerifiedAt,
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
