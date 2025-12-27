<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DisciplinaryAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisciplinaryActionController extends Controller
{
    public function index(Request $request)
    {
        $discipline = DisciplinaryAction::with(['player', 'match'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/discipline/index', [
            'discipline' => $discipline,
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
