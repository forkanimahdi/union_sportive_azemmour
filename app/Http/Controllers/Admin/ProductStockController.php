<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductStockController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'is_active' => $p->is_active,
                'category' => $p->category?->name,
                'stock_by_size' => $p->normalizedStockBySize(),
                'stock_summary' => $p->stockSummaryForAdmin(),
            ]);

        return Inertia::render('admin/boutique-stock', [
            'products' => $products,
            'sizes' => Product::SIZES,
            'lowStockThreshold' => (int) config('boutique.low_stock_threshold', 5),
        ]);
    }

    public function updateAll(Request $request)
    {
        $rules = [
            'stocks' => 'required|array',
            'stocks.*' => 'required|array',
        ];
        foreach (Product::SIZES as $size) {
            $rules['stocks.*.'.$size] = 'required|integer|min:0|max:999999';
        }

        $validated = $request->validate($rules);

        foreach (array_keys($validated['stocks']) as $productId) {
            if (! Product::query()->whereKey($productId)->exists()) {
                throw ValidationException::withMessages([
                    'stocks' => 'Identifiant de produit invalide.',
                ]);
            }
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated['stocks'] as $productId => $sizes) {
                Product::query()->whereKey($productId)->update([
                    'stock_by_size' => Product::normalizeStockInput($sizes),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Stocks boutique enregistrés.');
    }
}
