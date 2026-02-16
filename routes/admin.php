<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SeasonController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\PlayerController;
use App\Http\Controllers\Admin\TrainingController;
use App\Http\Controllers\Admin\MatchController;
use App\Http\Controllers\Admin\ConvocationController;
use App\Http\Controllers\Admin\InjuryController;
use App\Http\Controllers\Admin\DisciplinaryActionController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ImageRightController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\OpponentTeamController;
use App\Http\Controllers\Admin\ClassmentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\SponsorController;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard - accessible to all authenticated users
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Classment (standings) - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::get('/classment', [ClassmentController::class, 'index'])->name('classment.index');
        Route::patch('/classment/standings/{standing}', [ClassmentController::class, 'update'])->name('classment.standings.update');
        Route::post('/classment/standings', [ClassmentController::class, 'store'])->name('classment.standings.store');
        Route::post('/classment/seed-from-matches', [ClassmentController::class, 'seedFromMatches'])->name('classment.seed-from-matches');
    });
    
    // Seasons - Admin & Technical Director
    Route::middleware('role:admin,technical_director')->group(function () {
        Route::resource('seasons', SeasonController::class);
        Route::get('seasons/{season}/teams/create', [TeamController::class, 'createForSeason'])->name('seasons.teams.create');
        Route::post('seasons/{season}/duplicate', [SeasonController::class, 'duplicate'])->name('seasons.duplicate');
        Route::post('seasons/{season}/assign-team', [SeasonController::class, 'assignTeam'])->name('seasons.assign-team');
        Route::get('seasons/{season}/export', [SeasonController::class, 'export'])->name('seasons.export');
        Route::get('seasons/{season}/bulk-message', [SeasonController::class, 'bulkMessage'])->name('seasons.bulk-message');
    });

    // Teams - Admin & Technical Director
    Route::middleware('role:admin,technical_director')->group(function () {
        Route::resource('teams', TeamController::class);
        Route::get('teams/{team}/export', [TeamController::class, 'exportRoster'])->name('teams.export');
        Route::post('teams/{team}/assign-player', [TeamController::class, 'assignPlayer'])->name('teams.assign-player');
        Route::delete('teams/{team}/players/{player}', [TeamController::class, 'removePlayer'])->name('teams.remove-player');
    });
    
    // Opponent Teams & Leaderboard - Admin & Technical Director
    Route::middleware('role:admin,technical_director')->group(function () {
        Route::resource('opponent-teams', OpponentTeamController::class);
        Route::post('opponent-teams/{opponentTeam}/update-rank', [OpponentTeamController::class, 'updateRank'])->name('opponent-teams.update-rank');
    });
    
    // Staff - Admin & Technical Director
    Route::middleware('role:admin,technical_director')->group(function () {
        Route::resource('staff', StaffController::class);
    });
    
    // Players - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::resource('players', PlayerController::class);
        Route::get('players/{player}/export', [PlayerController::class, 'export'])->name('players.export');
    });
    
    // Trainings - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::resource('trainings', TrainingController::class);
        Route::post('trainings/{training}/attendance', [TrainingController::class, 'updateAttendance'])->name('trainings.attendance');
    });
    
    // Matches - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::get('fixtures', [MatchController::class, 'fixtures'])->name('fixtures.index');
        Route::resource('matches', MatchController::class);
        Route::get('matches/{match}/data', [MatchController::class, 'matchData'])->name('matches.data');
        Route::post('matches/{match}/lineup', [MatchController::class, 'updateLineup'])->name('matches.lineup');
        Route::post('matches/{match}/events', [MatchController::class, 'addEvent'])->name('matches.events');
        Route::delete('matches/{match}/events/{event}', [MatchController::class, 'destroyEvent'])->name('matches.events.destroy');
        Route::post('matches/{match}/finish', [MatchController::class, 'finishMatch'])->name('matches.finish');
        Route::post('matches/{match}/update-score', [MatchController::class, 'updateScore'])->name('matches.update-score');
        Route::post('matches/{match}/update-status', [MatchController::class, 'updateStatus'])->name('matches.update-status');
    });
    
    // Convocations - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::resource('convoctions', ConvocationController::class);
        Route::post('convoctions/{convocation}/send', [ConvocationController::class, 'send'])->name('convoctions.send');
    });
    
    // Injuries - Admin, Technical Director & Physiotherapist
    Route::middleware('role:admin,technical_director,physiotherapist')->group(function () {
        Route::resource('injuries', InjuryController::class);
        Route::post('injuries/{injury}/validate', [InjuryController::class, 'validate'])->name('injuries.validate');
    });
    
    // Discipline - Admin, Technical Director & Coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        Route::resource('discipline', DisciplinaryActionController::class);
    });
    
    // Media - Admin, Technical Director & Communication
    Route::middleware('role:admin,technical_director,communication')->group(function () {
        Route::resource('media', MediaController::class);
        Route::post('media/{media}/approve', [MediaController::class, 'approve'])->name('media.approve');
    });
    
    // Image Rights - Admin, Technical Director & Communication
    Route::middleware('role:admin,technical_director,communication')->group(function () {
        Route::resource('image-rights', ImageRightController::class);
    });
    
    // Equipment - Admin & Technical Director
    Route::middleware('role:admin,technical_director')->group(function () {
        Route::resource('equipment', EquipmentController::class);
        Route::post('equipment/{equipment}/movement', [EquipmentController::class, 'addMovement'])->name('equipment.movement');
    });

    // Boutique (Products & Orders) - Admin
    Route::middleware('role:admin')->group(function () {
        Route::resource('products', ProductController::class);
        Route::get('product-categories', [ProductCategoryController::class, 'index'])->name('product-categories.index');
        Route::post('product-categories', [ProductCategoryController::class, 'store'])->name('product-categories.store');
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    });

    // Communications - Articles, Sponsors & Histoires
    Route::middleware('role:admin,communication')->group(function () {
        Route::resource('articles', ArticleController::class);
        Route::resource('sponsors', SponsorController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);
        Route::get('histoires', fn () => Inertia::render('admin/histoires/index'))->name('histoires.index');
    });
});
