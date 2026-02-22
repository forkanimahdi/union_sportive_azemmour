<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\OpponentTeam;
use App\Models\Player;
use App\Models\Season;
use App\Models\Standing;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private const SLUG_TO_CATEGORY = [
        'senior' => 'Senior',
        'u17' => 'U17',
        'u15' => 'U15',
        'u13' => 'U13',
        'u7' => null,
    ];

    public function show(Request $request, string $category)
    {
        $slug = strtolower($category);
        $valid = array_key_exists($slug, self::SLUG_TO_CATEGORY);
        if (! $valid) {
            abort(404, 'Catégorie non trouvée');
        }

        $dbCategory = self::SLUG_TO_CATEGORY[$slug];
        $activeSeason = Season::where('is_active', true)->first();

        $nextMatch = null;
        $results = [];
        $form = [];
        $standings = [];
        $players = [];
        $staff = [];
        $stats = ['rank' => '–', 'points' => 0, 'players' => 0, 'goalDiff' => '–'];
        $team = null;

        if ($activeSeason && $dbCategory) {
            $team = Team::where('season_id', $activeSeason->id)
                ->where('category', $dbCategory)
                ->where('is_active', true)
                ->first();

            // Matches for this category
            $matchesQuery = GameMatch::with(['team', 'opponentTeam'])
                ->whereHas('team', fn ($q) => $q->where('season_id', $activeSeason->id)->where('category', $dbCategory))
                ->where('category', $dbCategory)
                ->whereIn('status', ['scheduled', 'live', 'finished']);

            $allMatches = $matchesQuery->orderBy('scheduled_at')->get();
            $now = now();

            // Next match (first future)
            $next = $allMatches->filter(fn ($m) => $m->scheduled_at && $m->scheduled_at->gte($now))->first();
            if ($next) {
                $weAreHome = $next->type === 'domicile';
                $nextMatch = [
                    'homeTeam' => $weAreHome ? 'USA' : ($next->opponentTeam?->name ?? $next->opponent ?? '?'),
                    'homeTeamLogo' => $weAreHome ? '/assets/images/logo.png' : ($next->opponentTeam?->logo ? '/storage/' . $next->opponentTeam->logo : null),
                    'awayTeam' => ! $weAreHome ? 'USA' : ($next->opponentTeam?->name ?? $next->opponent ?? '?'),
                    'awayTeamLogo' => ! $weAreHome ? '/assets/images/logo.png' : ($next->opponentTeam?->logo ? '/storage/' . $next->opponentTeam->logo : null),
                    'date' => $next->scheduled_at->translatedFormat('l d F Y'),
                    'time' => $next->scheduled_at->format('H:i'),
                    'venue' => $next->venue ? '📍 ' . $next->venue : null,
                ];
            }

            // Last 5 finished matches (for results list + form) — chronological: oldest first
            $finished = $allMatches
                ->filter(fn ($m) => $m->status === 'finished' && $m->home_score !== null && $m->away_score !== null)
                ->sortByDesc('scheduled_at')
                ->take(5)
                ->values()
                ->reverse()
                ->values();

            foreach ($finished as $m) {
                $weAreHome = $m->type === 'domicile';
                $ourScore = $weAreHome ? $m->home_score : $m->away_score;
                $theirScore = $weAreHome ? $m->away_score : $m->home_score;
                $scoreStr = $weAreHome ? "{$m->home_score} – {$m->away_score}" : "{$m->away_score} – {$m->home_score}";

                if ($ourScore > $theirScore) {
                    $type = 'win';
                } elseif ($ourScore < $theirScore) {
                    $type = 'loss';
                } else {
                    $type = 'draw';
                }

                $formCode = $type === 'win' ? 'W' : ($type === 'draw' ? 'D' : 'L');
                $form[] = $formCode;
                $opponent = $m->opponentTeam ?? null;
                $results[] = [
                    'date' => $m->scheduled_at->translatedFormat('d M'),
                    'opponent' => $opponent?->name ?? $m->opponent ?? '?',
                    'opponentLogo' => $opponent?->logo ? '/storage/' . $opponent->logo : null,
                    'venue' => $weAreHome ? 'Domicile' : 'Extérieur',
                    'score' => $scoreStr,
                    'type' => $type,
                ];
            }

            // Form for nextMatch: same order as results (oldest → newest, left to right)
            if ($nextMatch !== null && count($form) > 0) {
                $nextMatch['form'] = $form;
            }

            // Standings (load team relation so display_name works for USA row)
            $standingRows = Standing::with(['opponentTeam', 'team'])
                ->where('season_id', $activeSeason->id)
                ->where('category', $dbCategory)
                ->get();

            $sorted = $standingRows->sort(function ($a, $b) {
                $pa = ($a->wins * 3) + $a->draws;
                $pb = ($b->wins * 3) + $b->draws;
                if ($pa !== $pb) {
                    return $pb <=> $pa;
                }
                return ($b->goals_for - $b->goals_against) <=> ($a->goals_for - $a->goals_against);
            })->values();

            $usaRank = null;
            foreach ($sorted as $i => $s) {
                $isUsa = $s->team_id !== null;
                if ($isUsa) {
                    $usaRank = $i + 1;
                }
                $displayName = $isUsa ? ($s->team?->name ?? 'USA Azemmour') : $s->display_name;
                $logo = $isUsa ? '/assets/images/logo.png' : ($s->opponentTeam?->logo ? '/storage/' . $s->opponentTeam->logo : null);
                $standings[] = [
                    'rank' => $i + 1,
                    'team' => $displayName,
                    'teamLogo' => $logo,
                    'played' => $s->matches_played,
                    'pts' => ($s->wins * 3) + $s->draws,
                    'isUsa' => $isUsa,
                ];
            }

            // Stats from standings
            if ($usaRank !== null) {
                $stats['rank'] = $usaRank === 1 ? '1ER' : $usaRank . 'ÈME';
                $usaRow = $sorted->firstWhere(fn ($s) => $s->team_id !== null);
                if ($usaRow) {
                    $stats['points'] = ($usaRow->wins * 3) + $usaRow->draws;
                    $stats['goalDiff'] = ($usaRow->goals_for - $usaRow->goals_against) >= 0
                        ? '+' . ($usaRow->goals_for - $usaRow->goals_against)
                        : (string) ($usaRow->goals_for - $usaRow->goals_against);
                }
            }

            // Players
            if ($team) {
                $stats['players'] = $team->players()->where('is_active', true)->count();
                $players = $team->players()
                    ->where('is_active', true)
                    ->orderBy('jersey_number')
                    ->orderBy('last_name')
                    ->get()
                    ->map(function ($p) {
                        $pos = $p->position ?? 'Joueuse';
                        $initials = strtoupper(mb_substr($p->first_name ?? '', 0, 1) . mb_substr($p->last_name ?? '', 0, 1));
                        if (strlen($initials) < 2) {
                            $initials = strtoupper(mb_substr($p->last_name ?? '?', 0, 2));
                        }

                        return [
                            'id' => $p->id,
                            'initials' => $initials,
                            'number' => $p->jersey_number ?? 0,
                            'position' => $pos,
                            'first' => $p->first_name,
                            'last' => $p->last_name,
                            'photo' => $p->photo ? '/storage/' . $p->photo : null,
                            'matches' => 0,
                            'note' => null,
                            'goals' => null,
                        ];
                    })
                    ->values()
                    ->all();

                // Staff for this team (primary first, then any assigned)
                $staffMembers = $team->staff()
                    ->orderByPivot('is_primary', 'desc')
                    ->get();
                $staff = $staffMembers->map(function ($s) {
                    $initials = strtoupper(mb_substr($s->first_name ?? '', 0, 1) . mb_substr($s->last_name ?? '', 0, 1));
                    if (strlen($initials) < 2) {
                        $initials = strtoupper(mb_substr($s->last_name ?? '?', 0, 2));
                    }
                    $role = \App\Models\Staff::ROLES[$s->role] ?? $s->role ?? 'Staff';

                    return [
                        'initials' => $initials,
                        'role' => $role,
                        'name' => trim(($s->first_name ?? '') . ' ' . ($s->last_name ?? '')),
                        'detail' => $s->specialization ?? '',
                        'image' => $s->image ? '/storage/' . $s->image : null,
                    ];
                })->values()->all();
            }
        }

        $displayNames = [
            'senior' => 'Senior',
            'u17' => 'U17',
            'u15' => 'U15',
            'u13' => 'U13',
            'u7' => 'U7',
        ];
        $heroNumbers = ['senior' => '01', 'u17' => '02', 'u15' => '03', 'u13' => '04', 'u7' => '05'];
        $divisions = [
            'senior' => "Division d'Honneur Régionale — Ligue Chaouia Doukkala",
            'u17' => 'Championnat Régional U17 — Ligue Chaouia Doukkala',
            'u15' => 'Championnat Régional U15 — Ligue Chaouia Doukkala',
            'u13' => 'Championnat Régional U13 — Ligue Chaouia Doukkala',
            'u7' => 'École de football — Initiation',
        ];

        return Inertia::render('Category/index', [
            'category' => $slug,
            'displayName' => $displayNames[$slug] ?? 'Senior',
            'heroNumber' => $heroNumbers[$slug] ?? '01',
            'division' => $divisions[$slug] ?? '',
            'seasonName' => $activeSeason?->name ?? '2025–2026',
            'stats' => $stats,
            'nextMatch' => $nextMatch,
            'results' => $results,
            'standings' => $standings,
            'players' => $players,
            'staff' => $staff,
        ]);
    }
}
