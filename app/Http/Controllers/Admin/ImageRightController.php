<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImageRight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImageRightController extends Controller
{
    public function index(Request $request)
    {
        $imageRights = ImageRight::with(['player'])
            ->orderBy('signed_date', 'desc')
            ->paginate(15);

        return Inertia::render('admin/image-rights/index', [
            'imageRights' => $imageRights,
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
