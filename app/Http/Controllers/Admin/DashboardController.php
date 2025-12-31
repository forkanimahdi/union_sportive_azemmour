<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Training;
use App\Models\GameMatch;
use App\Models\Injury;
use App\Models\DisciplinaryAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Stats générales
        $stats = [
            'total_players' => Player::where('is_active', true)->count(),
            'upcoming_trainings' => Training::where('status', 'scheduled')
                ->where('scheduled_at', '>=', now())
                ->count(),
            'upcoming_matches' => GameMatch::where('status', 'scheduled')
                ->where('scheduled_at', '>=', now())
                ->count(),
            'unavailable_players' => Player::where('is_active', true)
                ->where(function ($query) {
                    $query->whereHas('injuries', function ($q) {
                        $q->where('status', '!=', 'apte')
                          ->where('fit_to_play', false);
                    })
                    ->orWhereHas('disciplinaryActions', function ($q) {
                        $q->where('is_active', true)
                          ->where(function ($q2) {
                              $q2->whereNull('suspension_end_date')
                                 ->orWhere('suspension_end_date', '>=', now());
                          });
                    });
                })
                ->count(),
        ];

        // Prochains matchs - group by category
        $upcomingMatchesByCategory = GameMatch::with(['team', 'competition'])
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->groupBy(function ($match) {
                return $match->category ?? $match->team?->category ?? 'Autre';
            })
            ->map(function ($matches, $category) {
                return $matches->take(3)->map(function ($match) {
                    return [
                        'id' => $match->id,
                        'opponent' => $match->opponent,
                        'scheduled_at' => $match->scheduled_at,
                        'venue' => $match->venue,
                        'type' => $match->type,
                        'status' => $match->status,
                        'home_score' => $match->home_score,
                        'away_score' => $match->away_score,
                        'team' => $match->team ? ['name' => $match->team->name, 'category' => $match->team->category] : null,
                        'competition' => $match->competition ? ['name' => $match->competition->name] : null,
                        'category' => $match->category ?? $match->team?->category ?? 'Autre',
                    ];
                })->values();
            });

        // Joueuses indisponibles - group by category
        $unavailablePlayersByCategory = Player::with('team')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereHas('injuries', function ($q) {
                    $q->where('status', '!=', 'apte')
                      ->where('fit_to_play', false);
                })
                ->orWhereHas('disciplinaryActions', function ($q) {
                    $q->where('is_active', true)
                      ->where(function ($q2) {
                          $q2->whereNull('suspension_end_date')
                             ->orWhere('suspension_end_date', '>=', now());
                      });
                });
            })
            ->get()
            ->groupBy(function ($player) {
                return $player->team?->category ?? 'Sans Équipe';
            })
            ->map(function ($players, $category) {
                return $players->take(6)->map(function ($player) {
                    return [
                        'id' => $player->id,
                        'first_name' => $player->first_name,
                        'last_name' => $player->last_name,
                        'photo' => $player->photo,
                        'jersey_number' => $player->jersey_number,
                        'position' => $player->position,
                        'date_of_birth' => $player->date_of_birth,
                        'phone' => $player->phone,
                        'email' => $player->email,
                        'can_play' => $player->canPlay(),
                        'team' => $player->team ? ['name' => $player->team->name, 'category' => $player->team->category] : null,
                        'category' => $player->team?->category ?? 'Sans Équipe',
                    ];
                })->values();
            });

        // Entraînements récents - group by category
        $recentTrainingsByCategory = Training::with('team')
            ->where('status', 'completed')
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->groupBy(function ($training) {
                return $training->team?->category ?? 'Autre';
            })
            ->map(function ($trainings, $category) {
                return $trainings->take(5)->map(function ($training) {
                    return [
                        'id' => $training->id,
                        'scheduled_at' => $training->scheduled_at,
                        'location' => $training->location,
                        'status' => $training->status,
                        'team' => $training->team ? ['name' => $training->team->name, 'category' => $training->team->category] : null,
                        'category' => $training->team?->category ?? 'Autre',
                    ];
                })->values();
            });

        // Alertes
        $alerts = [];
        
        // Certificats médicaux expirés
        $expiredMedicalCerts = Player::where('is_active', true)
            ->whereNotNull('medical_certificate_expiry')
            ->where('medical_certificate_expiry', '<', now())
            ->count();
        if ($expiredMedicalCerts > 0) {
            $alerts[] = "{$expiredMedicalCerts} certificat(s) médical(aux) expiré(s)";
        }

        // Autorisations image expirées
        $expiredImageRights = \App\Models\ImageRight::whereNotNull('expiry_date')
            ->where('expiry_date', '<', now())
            ->where('consent_status', '!=', 'non_signe')
            ->count();
        if ($expiredImageRights > 0) {
            $alerts[] = "{$expiredImageRights} autorisation(s) droit à l'image expirée(s)";
        }

        // Get all categories
        $categories = \App\Models\Team::distinct()->pluck('category')->filter()->sort()->values()->toArray();
        
        // Ensure 'Senior' is first if it exists
        if (in_array('Senior', $categories)) {
            $categories = array_merge(['Senior'], array_diff($categories, ['Senior']));
        }

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'upcomingMatchesByCategory' => $upcomingMatchesByCategory,
            'unavailablePlayersByCategory' => $unavailablePlayersByCategory,
            'recentTrainingsByCategory' => $recentTrainingsByCategory,
            'alerts' => $alerts,
            'categories' => $categories,
        ]);
    }
}
