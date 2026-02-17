<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $staff = Staff::with(['teams.season'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(15)
            ->through(function ($s) {
                return [
                    'id' => $s->id,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'email' => $s->email,
                    'phone' => $s->phone,
                    'role' => $s->role,
                    'role_label' => Staff::ROLES[$s->role] ?? $s->role,
                    'section' => $s->section,
                    'section_label' => Staff::SECTIONS[$s->section] ?? $s->section,
                    'priority' => $s->priority,
                    'image' => $s->image ? '/storage/' . $s->image : null,
                    'is_active' => $s->is_active,
                    'teams' => $s->teams->map(fn($t) => [
                        'id' => $t->id,
                        'name' => $t->name,
                        'category' => $t->category,
                        'pivot_role' => $t->pivot->role,
                        'pivot_role_label' => Staff::ROLES[$t->pivot->role] ?? $t->pivot->role,
                    ])->values()->all(),
                ];
            });

        $teams = Team::where('is_active', true)->with('season')->get()->map(fn ($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'season' => $t->season ? ['id' => $t->season->id, 'name' => $t->season->name] : null,
        ]);

        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
            'roleOptions' => Staff::ROLES,
            'sectionOptions' => Staff::SECTIONS,
            'teams' => $teams,
        ]);
    }

    public function create()
    {
        $teams = Team::where('is_active', true)->with('season')->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'season' => $t->season ? ['id' => $t->season->id, 'name' => $t->season->name] : null,
        ]);

        return Inertia::render('admin/staff/create', [
            'roleOptions' => Staff::ROLES,
            'sectionOptions' => Staff::SECTIONS,
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:2048',
            'role' => 'nullable|string|in:' . implode(',', Staff::ROLE_KEYS),
            'section' => 'nullable|string|in:' . implode(',', Staff::SECTION_KEYS),
            'priority' => 'nullable|integer|min:0',
            'specialization' => 'nullable|string|max:500',
            'license_number' => 'nullable|string|max:100',
            'hire_date' => 'nullable|date',
            'is_active' => 'boolean',
            'team_assignments' => 'nullable|array',
            'team_assignments.*.team_id' => 'nullable|uuid|exists:teams,id',
            'team_assignments.*.role' => 'nullable|string|in:' . implode(',', Staff::ROLE_KEYS),
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('staff', 'public');
        }

        $teamAssignments = array_values(array_filter($validated['team_assignments'] ?? [], fn ($a) => ! empty($a['team_id'] ?? null) && ! empty($a['role'] ?? null)));
        unset($validated['team_assignments']);
        $validated['is_active'] = $request->boolean('is_active', true);

        $staff = Staff::create($validated);

        foreach ($teamAssignments as $a) {
            $staff->teams()->syncWithoutDetaching([
                $a['team_id'] => [
                    'role' => $a['role'],
                    'is_primary' => false,
                ],
            ]);
        }

        return redirect()->route('admin.staff.index')->with('success', 'Membre du staff créé.');
    }

    public function show(Staff $staff)
    {
        $staff->load(['teams.season']);
        return Inertia::render('admin/staff/show', [
            'staff' => [
                'id' => $staff->id,
                'first_name' => $staff->first_name,
                'last_name' => $staff->last_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'image' => $staff->image ? '/storage/' . $staff->image : null,
                'role' => $staff->role,
                'role_label' => Staff::ROLES[$staff->role] ?? $staff->role,
                'section' => $staff->section,
                'section_label' => Staff::SECTIONS[$staff->section] ?? $staff->section,
                'priority' => $staff->priority,
                'specialization' => $staff->specialization,
                'license_number' => $staff->license_number,
                'hire_date' => $staff->hire_date?->format('Y-m-d'),
                'is_active' => $staff->is_active,
                'teams' => $staff->teams->map(fn($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'category' => $t->category,
                    'season' => $t->season ? ['id' => $t->season->id, 'name' => $t->season->name] : null,
                    'pivot_role' => $t->pivot->role,
                    'pivot_role_label' => Staff::ROLES[$t->pivot->role] ?? $t->pivot->role,
                ])->values()->all(),
            ],
            'roleOptions' => Staff::ROLES,
        ]);
    }

    public function edit(Staff $staff)
    {
        $staff->load('teams');
        $teams = Team::where('is_active', true)->with('season')->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
            'season' => $t->season ? ['id' => $t->season->id, 'name' => $t->season->name] : null,
        ]);

        $teamAssignments = $staff->teams->map(fn($t) => [
            'team_id' => $t->id,
            'role' => $t->pivot->role,
        ])->values()->all();

        return Inertia::render('admin/staff/edit', [
            'staff' => [
                'id' => $staff->id,
                'first_name' => $staff->first_name,
                'last_name' => $staff->last_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'image' => $staff->image ? '/storage/' . $staff->image : null,
                'role' => $staff->role,
                'section' => $staff->section,
                'priority' => $staff->priority,
                'specialization' => $staff->specialization,
                'license_number' => $staff->license_number,
                'hire_date' => $staff->hire_date?->format('Y-m-d'),
                'is_active' => $staff->is_active,
                'team_assignments' => $teamAssignments,
            ],
            'roleOptions' => Staff::ROLES,
            'sectionOptions' => Staff::SECTIONS,
            'teams' => $teams,
        ]);
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable|image|max:2048',
            'role' => 'nullable|string|in:' . implode(',', Staff::ROLE_KEYS),
            'section' => 'nullable|string|in:' . implode(',', Staff::SECTION_KEYS),
            'priority' => 'nullable|integer|min:0',
            'specialization' => 'nullable|string|max:500',
            'license_number' => 'nullable|string|max:100',
            'hire_date' => 'nullable|date',
            'is_active' => 'boolean',
            'team_assignments' => 'nullable|array',
            'team_assignments.*.team_id' => 'nullable|uuid|exists:teams,id',
            'team_assignments.*.role' => 'nullable|string|in:' . implode(',', Staff::ROLE_KEYS),
        ]);

        if ($request->hasFile('image')) {
            if ($staff->image) {
                Storage::disk('public')->delete($staff->image);
            }
            $validated['image'] = $request->file('image')->store('staff', 'public');
        }

        $teamAssignments = array_values(array_filter($validated['team_assignments'] ?? [], fn ($a) => ! empty($a['team_id'] ?? null) && ! empty($a['role'] ?? null)));
        unset($validated['team_assignments']);
        $validated['is_active'] = $request->boolean('is_active', true);

        $staff->update($validated);

        $sync = collect($teamAssignments)->mapWithKeys(fn($a) => [
            $a['team_id'] => ['role' => $a['role'], 'is_primary' => false],
        ])->all();
        $staff->teams()->sync($sync);

        return redirect()->route('admin.staff.index')->with('success', 'Staff mis à jour.');
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();
        return redirect()->route('admin.staff.index')->with('success', 'Membre du staff supprimé.');
    }
}
