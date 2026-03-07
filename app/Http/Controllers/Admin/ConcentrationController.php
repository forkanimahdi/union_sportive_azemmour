<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concentration;
use App\Models\ConcentrationConvocation;
use App\Models\ConcentrationDay;
use App\Models\ConcentrationDayMeal;
use App\Models\Season;
use App\Models\Staff;
use App\Models\Team;
use App\Models\Training;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcentrationController extends Controller
{
    public function index(Request $request)
    {
        $concentrations = Concentration::with(['teams', 'responsible'])
            ->when($request->season_id, fn ($q) => $q->whereHas('teams', fn ($q2) => $q2->where('season_id', $request->season_id)))
            ->orderBy('start_date', 'desc')
            ->paginate(15)
            ->through(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'start_date' => $c->start_date->format('Y-m-d'),
                'end_date' => $c->end_date->format('Y-m-d'),
                'duration_days' => $c->duration_days,
                'location' => $c->location,
                'accommodation' => $c->accommodation,
                'objective' => $c->objective,
                'responsible' => $c->responsible ? ['id' => $c->responsible->id, 'name' => $c->responsible->name] : null,
                'teams' => $c->teams->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'category' => $t->category]),
            ]);

        $activeSeason = Season::where('is_active', true)->first();
        $teams = Team::when($activeSeason, fn ($q) => $q->where('season_id', $activeSeason->id))
            ->where('is_active', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category']);
        $seasons = Season::orderBy('start_date', 'desc')->get(['id', 'name', 'is_active']);

        return Inertia::render('admin/concentrations/index', [
            'concentrations' => $concentrations,
            'teams' => $teams,
            'seasons' => $seasons,
            'objectives' => Concentration::objectives(),
        ]);
    }

    public function create()
    {
        $activeSeason = Season::where('is_active', true)->first();
        $teams = Team::when($activeSeason, fn ($q) => $q->where('season_id', $activeSeason->id))
            ->where('is_active', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category']);
        $staff = Staff::orderBy('name')->get(['id', 'name']);
        return Inertia::render('admin/concentrations/create', [
            'teams' => $teams,
            'staff' => $staff,
            'objectives' => Concentration::objectives(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'accommodation' => 'nullable|string|max:255',
            'objective' => 'required|in:preparation_match,cohesion,physique,autre',
            'responsible_id' => 'nullable|exists:staff,id',
            'notes' => 'nullable|string',
            'team_ids' => 'required|array',
            'team_ids.*' => 'exists:teams,id',
        ]);
        $teamIds = $validated['team_ids'];
        unset($validated['team_ids']);
        $concentration = Concentration::create($validated);
        $concentration->teams()->sync($teamIds);
        $start = Carbon::parse($concentration->start_date);
        $end = Carbon::parse($concentration->end_date);
        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            ConcentrationDay::create(['concentration_id' => $concentration->id, 'date' => $d->toDateString()]);
        }
        return redirect()->route('admin.concentrations.show', $concentration->id)->with('success', 'Concentration créée.');
    }

    public function show(string $id)
    {
        $concentration = Concentration::with([
            'teams', 'responsible', 'days.trainings.coach', 'days.meals', 'convocation.player',
        ])->findOrFail($id);
        $days = $concentration->days->map(fn ($day) => [
            'id' => $day->id,
            'date' => $day->date->format('Y-m-d'),
            'coach_notes' => $day->coach_notes,
            'trainings' => $day->trainings->map(fn ($t) => [
                'id' => $t->id,
                'scheduled_at' => $t->scheduled_at?->format('Y-m-d H:i'),
                'location' => $t->location,
                'session_type' => $t->session_type,
                'duration_minutes' => $t->duration_minutes,
                'time_slot' => $t->time_slot,
                'coach' => $t->coach ? ['id' => $t->coach->id, 'name' => $t->coach->name] : null,
                'team' => $t->team ? ['name' => $t->team->name, 'category' => $t->team->category] : null,
            ])->values(),
            'meals' => $day->meals->map(fn ($m) => ['id' => $m->id, 'type' => $m->type, 'time_slot' => $m->time_slot])->values(),
        ]);
        $convocation = $concentration->convocation->map(fn ($c) => [
            'id' => $c->id,
            'player_id' => $c->player_id,
            'player' => $c->player ? ['id' => $c->player->id, 'first_name' => $c->player->first_name, 'last_name' => $c->player->last_name, 'number' => $c->player->jersey_number] : null,
            'status' => $c->status,
            'notes' => $c->notes,
        ]);
        $teamIds = $concentration->teams->pluck('id');
        $players = \App\Models\Player::whereHas('teams', fn ($q) => $q->whereIn('teams.id', $teamIds)->where('player_team.is_primary', true))
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'jersey_number']);
        $staff = Staff::orderBy('name')->get(['id', 'name']);
        return Inertia::render('admin/concentrations/show', [
            'concentration' => [
                'id' => $concentration->id,
                'name' => $concentration->name,
                'start_date' => $concentration->start_date->format('Y-m-d'),
                'end_date' => $concentration->end_date->format('Y-m-d'),
                'duration_days' => $concentration->duration_days,
                'location' => $concentration->location,
                'accommodation' => $concentration->accommodation,
                'objective' => $concentration->objective,
                'responsible' => $concentration->responsible ? ['id' => $concentration->responsible->id, 'name' => $concentration->responsible->name] : null,
                'notes' => $concentration->notes,
                'teams' => $concentration->teams->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'category' => $t->category]),
                'days' => $days,
                'convocation' => $convocation,
            ],
            'playersForConvocation' => $players->map(fn ($p) => ['id' => $p->id, 'first_name' => $p->first_name, 'last_name' => $p->last_name, 'number' => $p->jersey_number]),
            'sessionTypes' => Training::sessionTypes(),
            'timeSlots' => Training::timeSlots(),
            'convocationStatuses' => ConcentrationConvocation::statuses(),
            'mealTypes' => ConcentrationDayMeal::mealTypes(),
            'staff' => $staff->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
        ]);
    }

    public function edit(string $id)
    {
        $concentration = Concentration::with('teams')->findOrFail($id);
        $activeSeason = Season::where('is_active', true)->first();
        $teams = Team::when($activeSeason, fn ($q) => $q->where('season_id', $activeSeason->id))
            ->where('is_active', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category']);
        $staff = Staff::orderBy('name')->get(['id', 'name']);
        return Inertia::render('admin/concentrations/edit', [
            'concentration' => [
                'id' => $concentration->id,
                'name' => $concentration->name,
                'start_date' => $concentration->start_date->format('Y-m-d'),
                'end_date' => $concentration->end_date->format('Y-m-d'),
                'location' => $concentration->location,
                'accommodation' => $concentration->accommodation,
                'objective' => $concentration->objective,
                'responsible_id' => $concentration->responsible_id,
                'notes' => $concentration->notes,
                'team_ids' => $concentration->teams->pluck('id')->toArray(),
            ],
            'teams' => $teams,
            'staff' => $staff,
            'objectives' => Concentration::objectives(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $concentration = Concentration::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'accommodation' => 'nullable|string|max:255',
            'objective' => 'required|in:preparation_match,cohesion,physique,autre',
            'responsible_id' => 'nullable|exists:staff,id',
            'notes' => 'nullable|string',
            'team_ids' => 'required|array',
            'team_ids.*' => 'exists:teams,id',
        ]);
        $teamIds = $validated['team_ids'];
        unset($validated['team_ids']);
        $concentration->update($validated);
        $concentration->teams()->sync($teamIds);
        return redirect()->route('admin.concentrations.show', $concentration->id)->with('success', 'Concentration mise à jour.');
    }

    public function destroy(string $id)
    {
        Concentration::findOrFail($id)->delete();
        return redirect()->route('admin.concentrations.index')->with('success', 'Concentration supprimée.');
    }

    public function updateConvocation(Request $request, string $id)
    {
        $concentration = Concentration::findOrFail($id);
        $validated = $request->validate([
            'player_id' => 'required|exists:players,id',
            'status' => 'required|in:convoquee,presente,absente,forfait',
            'notes' => 'nullable|string',
        ]);
        $concentration->convocation()->updateOrCreate(
            ['player_id' => $validated['player_id']],
            ['status' => $validated['status'], 'notes' => $validated['notes'] ?? null]
        );
        return back()->with('success', 'Convocation mise à jour.');
    }

    public function syncConvocation(Request $request, string $id)
    {
        $concentration = Concentration::findOrFail($id);
        $validated = $request->validate([
            'player_ids' => 'required|array',
            'player_ids.*' => 'exists:players,id',
        ]);
        $existing = $concentration->convocation()->pluck('player_id')->toArray();
        foreach ($validated['player_ids'] as $playerId) {
            if (! in_array($playerId, $existing)) {
                $concentration->convocation()->create(['player_id' => $playerId, 'status' => 'convoquee']);
            }
        }
        return back()->with('success', 'Liste de convocation mise à jour.');
    }

    public function updateDayNotes(Request $request, string $concentration, string $dayId)
    {
        $day = ConcentrationDay::where('concentration_id', $concentration)->findOrFail($dayId);
        $day->update($request->validate(['coach_notes' => 'nullable|string']));
        return back()->with('success', 'Notes du jour enregistrées.');
    }

    public function addSessionToDay(Request $request, string $concentrationId, string $dayId)
    {
        $concentration = Concentration::with('teams')->findOrFail($concentrationId);
        $day = $concentration->days()->findOrFail($dayId);
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'coach_id' => 'nullable|exists:staff,id',
            'scheduled_at' => 'required|date',
            'location' => 'required|string|max:255',
            'session_type' => 'nullable|in:physique,tactique,technique,gardien,recuperation',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'time_slot' => 'required|in:matin,apres_midi,soir',
            'objectives' => 'nullable|string',
            'coach_notes' => 'nullable|string',
        ]);
        $validated['concentration_day_id'] = $day->id;
        $validated['status'] = 'scheduled';
        if (! $concentration->teams->contains('id', $validated['team_id'])) {
            abort(422, 'L\'équipe n\'est pas associée à cette concentration.');
        }
        Training::create($validated);
        return back()->with('success', 'Séance ajoutée au programme.');
    }

    public function addMealToDay(Request $request, string $concentrationId, string $dayId)
    {
        $day = ConcentrationDay::where('concentration_id', $concentrationId)->findOrFail($dayId);
        $validated = $request->validate([
            'type' => 'required|in:petit_dejeuner,dejeuner,diner,sieste',
            'time_slot' => 'nullable|in:matin,apres_midi,soir',
        ]);
        $day->meals()->create($validated);
        return back()->with('success', 'Repas / récupération ajouté.');
    }
}
