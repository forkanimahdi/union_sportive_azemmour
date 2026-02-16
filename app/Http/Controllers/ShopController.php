<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true)->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('product_category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)->orWhere('description', 'like', $term);
            });
        }

        $products = $query->get()->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'description' => $p->description ? \Str::limit(strip_tags($p->description), 120) : null,
            'image' => $p->image,
            'image_without_logo' => $p->image_without_logo,
            'image_customized_tshirt' => $p->image_customized_tshirt,
            'old_price' => $p->old_price,
            'new_price' => $p->new_price,
            'category' => $p->category ? ['id' => $p->category->id, 'name' => $p->category->name] : null,
        ]);

        $categories = ProductCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Shop/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }
        $product->load('category');
        return Inertia::render('Shop/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image,
                'image_without_logo' => $product->image_without_logo,
                'image_customized_tshirt' => $product->image_customized_tshirt,
                'old_price' => $product->old_price,
                'new_price' => $product->new_price,
                'category' => $product->category ? ['id' => $product->category->id, 'name' => $product->category->name] : null,
            ],
        ]);
    }

    public function storeOrder(Request $request, Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'email'          => 'required|email',
            'phone'          => 'required|string|max:30',
            'size'           => 'required|string|in:XS,S,M,L,XL,XXL',
            'quantity'       => 'nullable|integer|min:1|max:10',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $validated['product_id'] = $product->id;
        $validated['quantity'] = $validated['quantity'] ?? 1;
        $validated['status'] = Order::STATUS_PENDING;

        $order = Order::create($validated);

        try {
            Mail::to($order->email)->send(new OrderConfirmationMail($order));
        } catch (\Throwable $e) {
            report($e);
        }

        return back()->with('orderSuccess', true);
    }
}
