<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        $query = Player::with(['team']);

        // Filters
        if ($request->team_id) {
            $query->where('team_id', $request->team_id);
        }
        if ($request->position) {
            $query->where('position', $request->position);
        }
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        $players = $query->orderBy('last_name')
            ->paginate(20)
            ->through(function ($player) {
                return [
                    'id' => $player->id,
                    'first_name' => $player->first_name,
                    'last_name' => $player->last_name,
                    'photo' => $player->photo,
                    'jersey_number' => $player->jersey_number,
                    'position' => $player->position,
                    'date_of_birth' => $player->date_of_birth?->format('Y-m-d'),
                    'team' => $player->team ? [
                        'id' => $player->team->id,
                        'name' => $player->team->name,
                    ] : null,
                    'is_active' => $player->is_active,
                    'can_play' => $player->canPlay(),
                ];
            });

        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
        ]);

        return Inertia::render('admin/players/index', [
            'players' => $players,
            'teams' => $teams,
            'filters' => $request->only(['team_id', 'position', 'search']),
        ]);
    }

    public function create()
    {
        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
        ]);

        return Inertia::render('admin/players/create', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'position' => 'nullable|in:gardien,defenseur,milieu,attaquant',
            'preferred_foot' => 'nullable|in:gauche,droit,ambidextre',
            'jersey_number' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('players/photos', 'public');
        }

        Player::create($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse créée avec succès');
    }

    public function show(Player $player)
    {
        $player->load(['team', 'injuries', 'disciplinaryActions', 'imageRight']);
        
        return Inertia::render('admin/players/show', [
            'player' => [
                'id' => $player->id,
                'first_name' => $player->first_name,
                'last_name' => $player->last_name,
                'photo' => $player->photo,
                'jersey_number' => $player->jersey_number,
                'position' => $player->position,
                'date_of_birth' => $player->date_of_birth?->format('Y-m-d'),
                'email' => $player->email,
                'phone' => $player->phone,
                'address' => $player->address,
                'team' => $player->team ? [
                    'id' => $player->team->id,
                    'name' => $player->team->name,
                ] : null,
                'is_active' => $player->is_active,
                'can_play' => $player->canPlay(),
                'is_minor' => $player->isMinor(),
                'injuries' => $player->injuries->map(fn($i) => [
                    'id' => $i->id,
                    'type' => $i->type,
                    'status' => $i->status,
                    'fit_to_play' => $i->fit_to_play,
                ]),
                'suspensions' => $player->disciplinaryActions()->where('is_active', true)->get()->map(fn($d) => [
                    'id' => $d->id,
                    'suspension_end_date' => $d->suspension_end_date?->format('Y-m-d'),
                ]),
            ],
        ]);
    }

    public function edit(Player $player)
    {
        $teams = Team::where('is_active', true)->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'category' => $t->category,
        ]);

        return Inertia::render('admin/players/edit', [
            'player' => [
                'id' => $player->id,
                'team_id' => $player->team_id,
                'first_name' => $player->first_name,
                'last_name' => $player->last_name,
                'date_of_birth' => $player->date_of_birth?->format('Y-m-d'),
                'position' => $player->position,
                'preferred_foot' => $player->preferred_foot,
                'jersey_number' => $player->jersey_number,
                'email' => $player->email,
                'phone' => $player->phone,
                'address' => $player->address,
                'guardian_name' => $player->guardian_name,
                'guardian_phone' => $player->guardian_phone,
                'guardian_email' => $player->guardian_email,
                'guardian_relationship' => $player->guardian_relationship,
                'photo' => $player->photo,
                'is_active' => $player->is_active,
            ],
            'teams' => $teams,
        ]);
    }

    public function update(Request $request, Player $player)
    {
        $validated = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'position' => 'nullable|in:gardien,defenseur,milieu,attaquant',
            'preferred_foot' => 'nullable|in:gauche,droit,ambidextre',
            'jersey_number' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_relationship' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('photo')) {
            if ($player->photo) {
                Storage::disk('public')->delete($player->photo);
            }
            $validated['photo'] = $request->file('photo')->store('players/photos', 'public');
        }

        $player->update($validated);

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse mise à jour avec succès');
    }

    public function destroy(Player $player)
    {
        if ($player->photo) {
            Storage::disk('public')->delete($player->photo);
        }
        $player->delete();

        return redirect()->route('admin.players.index')
            ->with('success', 'Joueuse supprimée avec succès');
    }
}
