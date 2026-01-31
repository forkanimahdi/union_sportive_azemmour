<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Convocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Convocations: when adding players to a match convocation, enforce Fit-to-Play gates.
 * Use FitToPlayGate::canBeConvoked($player) – if non-null, block add or set pivot block_reason.
 */
class ConvocationController extends Controller
{
    public function index(Request $request)
    {
        $convoctions = Convocation::with(['team'])
            ->orderBy('meeting_time', 'desc')
            ->paginate(15);

        return Inertia::render('admin/convoctions/index', [
            'convoctions' => $convoctions,
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
