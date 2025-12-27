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

        // Prochains matchs
        $upcomingMatches = GameMatch::with(['team', 'competition'])
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->limit(3)
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'opponent' => $match->opponent,
                    'scheduled_at' => $match->scheduled_at,
                    'venue' => $match->venue,
                    'type' => $match->type,
                    'status' => $match->status,
                    'home_score' => $match->home_score,
                    'away_score' => $match->away_score,
                    'team' => $match->team ? ['name' => $match->team->name] : null,
                    'competition' => $match->competition ? ['name' => $match->competition->name] : null,
                ];
            });

        // Joueuses indisponibles
        $unavailablePlayers = Player::with('team')
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
            ->limit(6)
            ->get()
            ->map(function ($player) {
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
                    'team' => $player->team ? ['name' => $player->team->name] : null,
                ];
            });

        // Entraînements récents
        $recentTrainings = Training::with('team')
            ->where('status', 'completed')
            ->orderBy('scheduled_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($training) {
                return [
                    'id' => $training->id,
                    'scheduled_at' => $training->scheduled_at,
                    'location' => $training->location,
                    'status' => $training->status,
                    'team' => $training->team ? ['name' => $training->team->name] : null,
                ];
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

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'upcomingMatches' => $upcomingMatches,
            'unavailablePlayers' => $unavailablePlayers,
            'recentTrainings' => $recentTrainings,
            'alerts' => $alerts,
        ]);
    }
}
