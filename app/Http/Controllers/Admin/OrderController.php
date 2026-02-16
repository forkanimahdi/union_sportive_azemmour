<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('product:id,name')->orderByDesc('created_at');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->get()->map(fn ($o) => [
            'id' => $o->id,
            'product_id' => $o->product_id,
            'product_name' => $o->product?->name,
            'customer_name' => $o->customer_name,
            'email' => $o->email,
            'phone' => $o->phone,
            'size' => $o->size,
            'quantity' => $o->quantity,
            'status' => $o->status,
            'notes' => $o->notes,
            'created_at' => $o->created_at->toISOString(),
        ]);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders->values()->all(),
            'statusLabels' => Order::statusLabels(),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,paid,sold,refund',
        ]);

        $order->update(['status' => $validated['status']]);

        return back();
    }
}
