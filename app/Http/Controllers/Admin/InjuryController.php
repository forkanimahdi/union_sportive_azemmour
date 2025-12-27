<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Injury;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InjuryController extends Controller
{
    public function index(Request $request)
    {
        $injuries = Injury::with(['player', 'reporter'])
            ->orderBy('injury_date', 'desc')
            ->paginate(15);

        return Inertia::render('admin/injuries/index', [
            'injuries' => $injuries,
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
