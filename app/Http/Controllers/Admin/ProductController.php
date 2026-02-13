<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('product_category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where('name', 'like', $term);
        }

        $products = $query->paginate(12)->through(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'description' => $p->description,
            'image' => $p->image,
            'image_without_logo' => $p->image_without_logo,
            'image_customized_tshirt' => $p->image_customized_tshirt,
            'old_price' => $p->old_price,
            'new_price' => $p->new_price,
            'category' => $p->category ? ['id' => $p->category->id, 'name' => $p->category->name] : null,
            'is_active' => $p->is_active,
        ]);

        $categories = ProductCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return redirect()->route('admin.products.index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'image_without_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'image_customized_tshirt' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'old_price' => 'nullable|numeric|min:0',
            'new_price' => 'nullable|numeric|min:0',
            'product_category_id' => 'nullable|exists:product_categories,id',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }
        if ($request->hasFile('image_without_logo')) {
            $validated['image_without_logo'] = $request->file('image_without_logo')->store('products', 'public');
        }
        if ($request->hasFile('image_customized_tshirt')) {
            $validated['image_customized_tshirt'] = $request->file('image_customized_tshirt')->store('products', 'public');
        }
        $validated['is_active'] = $request->boolean('is_active', true);

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        $product->load('category');
        $categories = ProductCategory::orderBy('name')->get(['id', 'name']);
        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image,
                'image_without_logo' => $product->image_without_logo,
                'image_customized_tshirt' => $product->image_customized_tshirt,
                'old_price' => $product->old_price,
                'new_price' => $product->new_price,
                'product_category_id' => $product->product_category_id,
                'is_active' => $product->is_active,
                'category' => $product->category ? ['id' => $product->category->id, 'name' => $product->category->name] : null,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'image_without_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'image_customized_tshirt' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'old_price' => 'nullable|numeric|min:0',
            'new_price' => 'nullable|numeric|min:0',
            'product_category_id' => 'nullable|exists:product_categories,id',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }
        if ($request->hasFile('image_without_logo')) {
            if ($product->image_without_logo) {
                Storage::disk('public')->delete($product->image_without_logo);
            }
            $validated['image_without_logo'] = $request->file('image_without_logo')->store('products', 'public');
        }
        if ($request->hasFile('image_customized_tshirt')) {
            if ($product->image_customized_tshirt) {
                Storage::disk('public')->delete($product->image_customized_tshirt);
            }
            $validated['image_customized_tshirt'] = $request->file('image_customized_tshirt')->store('products', 'public');
        }
        $validated['is_active'] = $request->boolean('is_active', true);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product)
    {
        foreach (['image', 'image_without_logo', 'image_customized_tshirt'] as $attr) {
            if ($product->$attr) {
                Storage::disk('public')->delete($product->$attr);
            }
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé.');
    }
}
