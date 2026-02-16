<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\GameMatch;
use App\Models\Product;
use App\Models\Season;
use App\Models\Sponsor;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $activeSeason = Season::where('is_active', true)->first();

        // Senior matches from active season only — order: nearest to today first (upcoming soonest, then past most recent)
        $matches = collect();
        if ($activeSeason) {
            $collection = GameMatch::with(['team', 'opponentTeam'])
                ->whereHas('team', function ($q) use ($activeSeason) {
                    $q->where('season_id', $activeSeason->id)->where('category', 'Senior');
                })
                ->where('category', 'Senior')
                ->whereIn('status', ['scheduled', 'live', 'finished'])
                ->get();

            $now = now();
            $future = $collection->filter(fn ($m) => $m->scheduled_at && $m->scheduled_at->gte($now))->sortBy('scheduled_at')->values();
            $past = $collection->filter(fn ($m) => !$m->scheduled_at || $m->scheduled_at->lt($now))->sortByDesc('scheduled_at')->values();
            $ordered = $future->concat($past);

            $matches = $ordered->map(function ($m) {
                $weAreHome = $m->type === 'domicile';
                $opponentLogo = $m->opponentTeam?->logo;
                return [
                    'id' => $m->id,
                    'home_team' => $weAreHome ? ($m->team?->name ?? 'USA') : ($m->opponentTeam?->name ?? $m->opponent ?? 'Adversaire'),
                    'away_team' => !$weAreHome ? ($m->team?->name ?? 'USA') : ($m->opponentTeam?->name ?? $m->opponent ?? 'Adversaire'),
                    'home_team_logo' => $weAreHome ? null : $opponentLogo,
                    'away_team_logo' => !$weAreHome ? null : $opponentLogo,
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

        // Sponsors for home page carousel
        $sponsors = Sponsor::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'logo' => $s->logo,
                'url' => $s->url,
            ]);

        // Products for Fan Shop / Merchandise section (active only, limit for carousel)
        $products = Product::with('category')
            // ->where('is_active', true)
            ->orderBy('name')
            ->limit(12)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'image' => $p->image,
                'old_price' => $p->old_price,
                'new_price' => $p->new_price,
                'category' => $p->category ? ['id' => $p->category->id, 'name' => $p->category->name] : null,
            ]);

        // Latest articles for Recent News (latest first)
        $articles = Article::with('user:id,name')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'author' => $a->user?->name ?? '–',
                'views' => $a->views,
                'image' => $a->image,
                'created_at' => $a->created_at?->toISOString(),
                'category' => 'Actualités',
            ]);

        return Inertia::render('welcome', [
            'matches' => $matches->values()->all(),
            'players' => $players->values()->all(),
            'articles' => $articles->values()->all(),
            'sponsors' => $sponsors->values()->all(),
            'products' => $products->values()->all(),
            'activeSeason' => $activeSeason ? ['id' => $activeSeason->id, 'name' => $activeSeason->name] : null,
        ]);
    }
}
