<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\Season;
use App\Models\Standing;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassmentController extends Controller
{
    public const CATEGORIES = ['Senior', 'U17', 'U15'];

    public function index(Request $request)
    {
        $seasonId = $request->input('season_id');
        $category = $request->input('category', 'Senior');

        if (!in_array($category, self::CATEGORIES, true)) {
            $category = 'Senior';
        }

        // All seasons (for filter) – most recent first
        $seasons = Season::orderByDesc('start_date')->get(['id', 'name', 'is_active', 'start_date'])->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'is_active' => $s->is_active,
        ]);

        $activeSeason = Season::where('is_active', true)->first();
        if (!$seasonId && $activeSeason) {
            $seasonId = $activeSeason->id;
        }
        if (!$seasonId && $seasons->isNotEmpty()) {
            $seasonId = $seasons->first()->id;
        }

        $standingsByCategory = [];
        $categories = self::CATEGORIES;
        $upcomingMatchByCategory = [];
        $dataVerifiedAt = null;
        $lastUpdatedLabel = null;

        if ($seasonId) {
            $season = Season::find($seasonId);
            if ($season) {
                $dataVerifiedAt = now()->format('H:i');
                $lastUpdatedLabel = now()->locale('fr_FR')->translatedFormat("Aujourd'hui à H:i");

                foreach (self::CATEGORIES as $cat) {
                    $rows = Standing::with(['team', 'opponentTeam'])
                        ->where('season_id', $seasonId)
                        ->where('category', $cat)
                        ->get();

                    $mapped = $rows->map(fn ($s) => [
                        'id' => $s->id,
                        'team_id' => $s->team_id,
                        'opponent_team_id' => $s->opponent_team_id,
                        'name' => $s->display_name,
                        'short_code' => $s->short_code,
                        'is_usa' => $s->is_usa,
                        'played' => $s->matches_played,
                        'wins' => $s->wins,
                        'draws' => $s->draws,
                        'losses' => $s->losses,
                        'goals_for' => $s->goals_for,
                        'goals_against' => $s->goals_against,
                        'goal_difference' => $s->goal_difference,
                        'points' => $s->points,
                        'matches_played' => $s->matches_played,
                    ]);

                    $sorted = $mapped->sort(function ($a, $b) {
                        if ($a['points'] !== $b['points']) {
                            return $b['points'] <=> $a['points'];
                        }
                        return $b['goal_difference'] <=> $a['goal_difference'];
                    })->values();

                    $withRank = $sorted->map(function ($r, $i) {
                        $r['rank'] = $i + 1;
                        $r['form'] = []; // optional: last 5 from matches
                        return $r;
                    });

                    $standingsByCategory[$cat] = $withRank->all();
                }

                // Upcoming match per category
                foreach (self::CATEGORIES as $cat) {
                    $teamIds = $season->teams()->where('category', $cat)->pluck('id');
                    $match = GameMatch::whereIn('team_id', $teamIds)
                        ->where('category', $cat)
                        ->where('status', 'scheduled')
                        ->whereNotNull('scheduled_at')
                        ->where('scheduled_at', '>=', now())
                        ->orderBy('scheduled_at')
                        ->with('team', 'opponentTeam')
                        ->first();

                    $upcomingMatchByCategory[$cat] = $match ? [
                        'id' => $match->id,
                        'opponent' => $match->opponentTeam?->name ?? $match->opponent ?? 'Adversaire',
                        'scheduled_at' => $match->scheduled_at->format('Y-m-d H:i'),
                        'venue' => $match->venue,
                        'team_name' => $match->team?->name,
                    ] : null;
                }
            }
        }

        return Inertia::render('admin/classment/index', [
            'seasons' => $seasons->values()->all(),
            'activeSeasonId' => $activeSeason?->id,
            'selectedSeasonId' => $seasonId,
            'selectedCategory' => $category,
            'standingsByCategory' => $standingsByCategory,
            'categories' => $categories,
            'upcomingMatchByCategory' => $upcomingMatchByCategory,
            'dataVerifiedAt' => $dataVerifiedAt,
            'lastUpdatedLabel' => $lastUpdatedLabel,
            'opponentTeamsForCategory' => $this->opponentTeamsForCategory($category),
        ]);
    }

    /** Opponent teams that can be added to classment (e.g. all with this category) */
    private function opponentTeamsForCategory(string $category): array
    {
        $teams = \App\Models\OpponentTeam::orderBy('name')->get();
        $list = [];
        foreach ($teams as $t) {
            $cats = is_array($t->category) ? $t->category : (array) $t->category;
            if (empty($cats) || in_array($category, $cats, true)) {
                $list[] = ['id' => $t->id, 'name' => $t->name];
            }
        }
        return $list;
    }

    public function update(Request $request, Standing $standing)
    {
        $validated = $request->validate([
            'matches_played' => 'required|integer|min:0',
            'wins' => 'required|integer|min:0',
            'draws' => 'required|integer|min:0',
            'losses' => 'required|integer|min:0',
            'goals_for' => 'required|integer|min:0',
            'goals_against' => 'required|integer|min:0',
        ]);

        $standing->update($validated);

        return back();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'season_id' => 'required|uuid|exists:seasons,id',
            'category' => 'required|string|in:Senior,U17,U15',
            'opponent_team_id' => 'required_without:team_id|nullable|uuid|exists:opponent_teams,id',
            'team_id' => 'required_without:opponent_team_id|nullable|uuid|exists:teams,id',
        ]);

        if (!empty($validated['opponent_team_id'])) {
            $exists = Standing::where('season_id', $validated['season_id'])
                ->where('category', $validated['category'])
                ->where('opponent_team_id', $validated['opponent_team_id'])
                ->exists();
            if ($exists) {
                return back()->withErrors(['opponent_team_id' => 'Cet adversaire est déjà dans le classement.']);
            }
            Standing::create([
                'season_id' => $validated['season_id'],
                'category' => $validated['category'],
                'opponent_team_id' => $validated['opponent_team_id'],
                'matches_played' => 0,
                'wins' => 0,
                'draws' => 0,
                'losses' => 0,
                'goals_for' => 0,
                'goals_against' => 0,
            ]);
        } elseif (!empty($validated['team_id'])) {
            $exists = Standing::where('season_id', $validated['season_id'])
                ->where('category', $validated['category'])
                ->where('team_id', $validated['team_id'])
                ->exists();
            if ($exists) {
                return back()->withErrors(['team_id' => 'Cette équipe est déjà dans le classement.']);
            }
            Standing::create([
                'season_id' => $validated['season_id'],
                'category' => $validated['category'],
                'team_id' => $validated['team_id'],
                'matches_played' => 0,
                'wins' => 0,
                'draws' => 0,
                'losses' => 0,
                'goals_for' => 0,
                'goals_against' => 0,
            ]);
        }

        return back();
    }

    /** Initialize standings for a season+category from match results (USA + opponents from matches) */
    public function seedFromMatches(Request $request)
    {
        $validated = $request->validate([
            'season_id' => 'required|uuid|exists:seasons,id',
            'category' => 'required|string|in:Senior,U17,U15',
        ]);

        $season = Season::find($validated['season_id']);
        $category = $validated['category'];

        $ourTeam = $season->teams()->where('category', $category)->where('is_active', true)->first();
        if (!$ourTeam) {
            return back()->withErrors(['category' => 'Aucune équipe USA pour cette catégorie.']);
        }

        $finished = GameMatch::where('team_id', $ourTeam->id)
            ->where('status', 'finished')
            ->get();

        $wins = $draws = $losses = 0;
        $gf = $ga = 0;
        $opponentStats = []; // opponent_team_id or opponent name => [w,d,l,gf,ga]

        foreach ($finished as $m) {
            $ourScore = $m->type === 'domicile' ? (int) $m->home_score : (int) $m->away_score;
            $theirScore = $m->type === 'domicile' ? (int) $m->away_score : (int) $m->home_score;
            $gf += $ourScore;
            $ga += $theirScore;

            if ($ourScore > $theirScore) {
                $wins++;
            } elseif ($ourScore < $theirScore) {
                $losses++;
            } else {
                $draws++;
            }

            $oppKey = $m->opponent_team_id ?? ('name:' . ($m->opponent ?? ''));
            if (!isset($opponentStats[$oppKey])) {
                $opponentStats[$oppKey] = ['w' => 0, 'd' => 0, 'l' => 0, 'gf' => 0, 'ga' => 0];
            }
            if ($theirScore > $ourScore) {
                $opponentStats[$oppKey]['w']++;
            } elseif ($theirScore < $ourScore) {
                $opponentStats[$oppKey]['l']++;
            } else {
                $opponentStats[$oppKey]['d']++;
            }
            $opponentStats[$oppKey]['gf'] += $theirScore;
            $opponentStats[$oppKey]['ga'] += $ourScore;
        }

        $mp = $wins + $draws + $losses;

        // Create or update only the USA row from match results. Opponents are managed manually.
        Standing::updateOrCreate(
            [
                'season_id' => $season->id,
                'category' => $category,
                'team_id' => $ourTeam->id,
            ],
            [
                'matches_played' => $mp,
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'goals_for' => $gf,
                'goals_against' => $ga,
                'opponent_team_id' => null,
            ]
        );

        return back()->with('success', 'Classement de votre équipe mis à jour à partir des matchs. Les adversaires ne sont pas modifiés.');
    }
}
