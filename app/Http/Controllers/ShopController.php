<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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
            'description' => $p->description ? Str::limit(strip_tags($p->description), 120) : null,
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

        $validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        $rules = [
            'customer_name'     => 'nullable|string|max:255',
            'email'             => 'required|email',
            'phone'             => 'required|string|max:30',
            'address_street'    => 'required|string|max:255',
            'address_city'      => 'required|string|max:255',
            'address_postal_code' => 'required|string|max:20',
            'address_country'   => 'required|string|max:100',
            'size'              => 'required|string|in:' . implode(',', $validSizes),
            'quantity'          => 'nullable|integer|min:1|max:10',
            'notes'             => 'nullable|string|max:1000',
        ];
        $rules['sizes'] = 'nullable|array';
        $rules['sizes.*'] = 'string|in:' . implode(',', $validSizes);

        $validated = $request->validate($rules);

        $quantity = (int) ($validated['quantity'] ?? 1);
        $validated['product_id'] = $product->id;
        $validated['quantity'] = $quantity;
        $validated['status'] = Order::STATUS_PENDING;

        if (!empty($validated['sizes']) && count($validated['sizes']) === $quantity) {
            $validated['sizes'] = array_values($validated['sizes']);
        } else {
            $validated['sizes'] = array_fill(0, $quantity, $validated['size']);
        }

        $subtotal = (float) ($product->new_price ?? $product->old_price ?? 0) * $quantity;
        $city = $validated['address_city'] ?? '';
        $validated['delivery_fee'] = $this->computeDeliveryFee($subtotal, $city);

        $order = Order::create($validated);

        try {
            Mail::to($order->email)->send(new OrderConfirmationMail($order));
        } catch (\Throwable $e) {
            report($e);
        }

        return back()->with('orderSuccess', true);
    }

    private function computeDeliveryFee(float $subtotal, string $city): float
    {
        $freeFrom = 600.0;
        if ($subtotal >= $freeFrom) {
            return 0.0;
        }
        $cityNormalized = strtolower(trim($city));
        if ($cityNormalized === 'casablanca') {
            return 30.0;
        }
        return 50.0;
    }
}
