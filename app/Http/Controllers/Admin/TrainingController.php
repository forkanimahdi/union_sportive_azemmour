<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concentration;
use App\Models\Season;
use App\Models\Staff;
use App\Models\Team;
use App\Models\Training;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function index(Request $request)
    {
        $activeSeason = Season::where('is_active', true)->first();
        $teams = Team::when($activeSeason, fn ($q) => $q->where('season_id', $activeSeason->id))
            ->where('is_active', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category']);

        $query = Training::with(['team', 'coach', 'concentrationDay.concentration'])
            ->whereNull('concentration_day_id');

        if ($request->season_id && $activeSeason && $request->season_id === $activeSeason->id) {
            $query->whereHas('team', fn ($q) => $q->where('season_id', $activeSeason->id));
        }
        if ($request->category) {
            $query->whereHas('team', fn ($q) => $q->where('category', $request->category));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $trainings = $query->orderBy('scheduled_at', 'desc')
            ->paginate(15, ['*'], 'sessions_page')
            ->withQueryString()
            ->through(fn ($t) => $this->formatSession($t));

        $concentrations = Concentration::with(['teams', 'responsible', 'days'])
            ->when($request->season_id, function ($q) use ($request) {
                $q->whereHas('teams', fn ($q2) => $q2->where('season_id', $request->season_id));
            })
            ->orderBy('start_date', 'desc')
            ->paginate(10, ['*'], 'concentrations_page')
            ->withQueryString()
            ->through(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'start_date' => $c->start_date->format('Y-m-d'),
                'end_date' => $c->end_date->format('Y-m-d'),
                'duration_days' => $c->duration_days,
                'location' => $c->location,
                'objective' => $c->objective,
                'responsible' => $c->responsible ? ['id' => $c->responsible->id, 'name' => $c->responsible->name] : null,
                'teams' => $c->teams->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'category' => $t->category]),
            ]);

        $seasons = Season::orderBy('start_date', 'desc')
            ->get()
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name, 'is_active' => $s->is_active]);

        return Inertia::render('admin/trainings/index', [
            'trainings' => $trainings,
            'concentrations' => $concentrations,
            'teams' => $teams,
            'seasons' => $seasons,
            'sessionTypes' => Training::sessionTypes(),
            'timeSlots' => Training::timeSlots(),
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
        return Inertia::render('admin/trainings/create', [
            'teams' => $teams,
            'staff' => $staff,
            'sessionTypes' => Training::sessionTypes(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'coach_id' => 'nullable|exists:staff,id',
            'scheduled_at' => 'required|date',
            'location' => 'required|string|max:255',
            'session_type' => 'nullable|in:physique,tactique,technique,gardien,recuperation',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'objectives' => 'nullable|string',
            'coach_notes' => 'nullable|string',
            'status' => 'nullable|in:scheduled,completed,cancelled',
        ]);
        $validated['status'] = $validated['status'] ?? 'scheduled';
        Training::create($validated);
        return redirect()->route('admin.trainings.index')->with('success', 'Séance créée.');
    }

    public function show(string $id)
    {
        $training = Training::with(['team', 'coach', 'attendances.player', 'concentrationDay.concentration'])->findOrFail($id);
        $team = $training->team;
        $players = $team ? $team->players()->wherePivot('is_primary', true)->orderBy('players.last_name')->get(['players.id', 'players.first_name', 'players.last_name', 'players.jersey_number']) : collect();
        $attendances = $training->attendances->keyBy('player_id');
        return Inertia::render('admin/trainings/show', [
            'training' => array_merge($this->formatSession($training), [
                'concentration' => $training->concentrationDay?->concentration ? [
                    'id' => $training->concentrationDay->concentration->id,
                    'name' => $training->concentrationDay->concentration->name,
                ] : null,
            ]),
            'players' => $players->map(fn ($p) => [
                'id' => $p->id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'number' => $p->jersey_number,
                'attendance' => $attendances->get($p->id) ? [
                    'status' => $attendances->get($p->id)->status,
                    'arrival_time' => $attendances->get($p->id)->arrival_time?->format('H:i'),
                    'notes' => $attendances->get($p->id)->notes,
                ] : null,
            ]),
            'sessionTypes' => Training::sessionTypes(),
        ]);
    }

    public function edit(string $id)
    {
        $training = Training::with('team')->findOrFail($id);
        $activeSeason = Season::where('is_active', true)->first();
        $teams = Team::when($activeSeason, fn ($q) => $q->where('season_id', $activeSeason->id))
            ->where('is_active', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category']);
        $staff = Staff::orderBy('name')->get(['id', 'name']);
        return Inertia::render('admin/trainings/edit', [
            'training' => $this->formatSession($training),
            'teams' => $teams,
            'staff' => $staff,
            'sessionTypes' => Training::sessionTypes(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $training = Training::findOrFail($id);
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'coach_id' => 'nullable|exists:staff,id',
            'scheduled_at' => 'required|date',
            'location' => 'required|string|max:255',
            'session_type' => 'nullable|in:physique,tactique,technique,gardien,recuperation',
            'duration_minutes' => 'nullable|integer|min:1|max:480',
            'objectives' => 'nullable|string',
            'coach_notes' => 'nullable|string',
            'status' => 'nullable|in:scheduled,completed,cancelled',
        ]);
        $training->update($validated);
        $redirect = $training->concentration_day_id
            ? route('admin.concentrations.show', $training->concentrationDay->concentration_id)
            : route('admin.trainings.show', $training->id);
        return redirect($redirect)->with('success', 'Séance mise à jour.');

    }

    public function destroy(string $id)
    {
        $training = Training::with('concentrationDay')->findOrFail($id);
        $concentrationId = $training->concentration_day_id ? $training->concentrationDay?->concentration_id : null;
        $training->delete();
        return redirect($concentrationId ? route('admin.concentrations.show', $concentrationId) : route('admin.trainings.index'))->with('success', 'Séance supprimée.');
    }

    public function updateAttendance(Request $request, Training $training)
    {
        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.player_id' => 'required|exists:players,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.arrival_time' => 'nullable|string',
            'attendances.*.notes' => 'nullable|string',
        ]);
        foreach ($validated['attendances'] as $row) {
            $training->attendances()->updateOrCreate(
                ['player_id' => $row['player_id']],
                [
                    'status' => $row['status'],
                    'arrival_time' => $row['arrival_time'] ?? null,
                    'notes' => $row['notes'] ?? null,
                ]
            );
        }
        return back()->with('success', 'Présences enregistrées.');
    }

    private function formatSession(Training $t): array
    {
        return [
            'id' => $t->id,
            'team_id' => $t->team_id,
            'team' => $t->team ? ['id' => $t->team->id, 'name' => $t->team->name, 'category' => $t->team->category] : null,
            'coach_id' => $t->coach_id,
            'coach' => $t->coach ? ['id' => $t->coach->id, 'name' => $t->coach->name] : null,
            'scheduled_at' => $t->scheduled_at?->format('Y-m-d\TH:i'),
            'location' => $t->location,
            'session_type' => $t->session_type,
            'duration_minutes' => $t->duration_minutes,
            'objectives' => $t->objectives,
            'coach_notes' => $t->coach_notes,
            'status' => $t->status,
            'concentration_day_id' => $t->concentration_day_id,
            'time_slot' => $t->time_slot,
        ];
    }
}
