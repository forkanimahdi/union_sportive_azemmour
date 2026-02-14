<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SponsorController extends Controller
{
    public function index(Request $request)
    {
        $sponsors = Sponsor::orderBy('sort_order')->orderBy('name')->get()->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'logo' => $s->logo,
            'url' => $s->url,
            'type' => $s->type,
            'type_label' => Sponsor::typeLabels()[$s->type] ?? $s->type,
            'sort_order' => $s->sort_order,
            'is_active' => $s->is_active,
        ]);

        return Inertia::render('admin/sponsors/index', [
            'sponsors' => $sponsors->values()->all(),
            'typeLabels' => Sponsor::typeLabels(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/sponsors/create', [
            'typeLabels' => Sponsor::typeLabels(),
        ]);
    }

    public function store(Request $request)
    {
        $request->merge(['url' => $request->url ?: null]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url|max:500',
            'type' => 'required|in:' . implode(',', array_keys(Sponsor::typeLabels())),
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('sponsors', 'public');
        }

        Sponsor::create($validated);

        return redirect()->route('admin.sponsors.index')->with('success', 'Sponsor créé.');
    }

    public function edit(Sponsor $sponsor)
    {
        return Inertia::render('admin/sponsors/edit', [
            'sponsor' => [
                'id' => $sponsor->id,
                'name' => $sponsor->name,
                'logo' => $sponsor->logo,
                'url' => $sponsor->url,
                'type' => $sponsor->type,
                'sort_order' => $sponsor->sort_order,
                'is_active' => $sponsor->is_active,
            ],
            'typeLabels' => Sponsor::typeLabels(),
        ]);
    }

    public function update(Request $request, Sponsor $sponsor)
    {
        $request->merge(['url' => $request->url ?: null]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url|max:500',
            'type' => 'required|in:' . implode(',', array_keys(Sponsor::typeLabels())),
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        if ($request->hasFile('logo')) {
            if ($sponsor->logo) {
                Storage::disk('public')->delete($sponsor->logo);
            }
            $validated['logo'] = $request->file('logo')->store('sponsors', 'public');
        }

        $sponsor->update($validated);

        return redirect()->route('admin.sponsors.index')->with('success', 'Sponsor mis à jour.');
    }

    public function destroy(Sponsor $sponsor)
    {
        if ($sponsor->logo) {
            Storage::disk('public')->delete($sponsor->logo);
        }
        $sponsor->delete();
        return redirect()->route('admin.sponsors.index')->with('success', 'Sponsor supprimé.');
    }
}
