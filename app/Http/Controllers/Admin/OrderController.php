<?php

namespace App\Http\Controllers\Admin;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Mail\OrderStatusNotificationMail;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class OrderController extends Controller
{
    private function orderToArray(Order $o): array
    {
        return [
            'id' => $o->id,
            'product_id' => $o->product_id,
            'product_name' => $o->product?->name,
            'customer_name' => $o->customer_name,
            'email' => $o->email,
            'phone' => $o->phone,
            'address_street' => $o->address_street,
            'address_city' => $o->address_city,
            'address_postal_code' => $o->address_postal_code,
            'address_country' => $o->address_country,
            'size' => $o->size,
            'sizes' => $o->sizes,
            'quantity' => $o->quantity,
            'status' => $o->status,
            'notes' => $o->notes,
            'delivery_fee' => $o->delivery_fee !== null ? (float) $o->delivery_fee : null,
            'created_at' => $o->created_at->toISOString(),
        ];
    }

    public function index(Request $request)
    {
        $query = $this->filteredOrdersQuery($request, false);

        $orders = $query->get()->map(fn ($o) => $this->orderToArray($o));

        return Inertia::render('admin/orders/index', [
            'orders' => $orders->values()->all(),
            'statusLabels' => Order::statusLabels(),
            'exportColumns' => collect(OrdersExport::COLUMN_LABELS)
                ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
                ->values()
                ->all(),
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', 'all'),
            ],
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:all,pending,confirmed,paid,sold,refund',
            'statuses' => 'nullable|array',
            'statuses.*' => 'string|in:pending,confirmed,paid,sold,refund',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'columns' => 'nullable|array',
            'columns.*' => 'string|in:'.implode(',', array_keys(OrdersExport::COLUMN_LABELS)),
        ]);

        $query = $this->filteredOrdersQuery($request, true);

        $orders = $query->get();
        $columns = $validated['columns'] ?? [];
        $export = new OrdersExport($orders, $columns, Order::statusLabels());
        $filename = 'commandes-'.now()->format('Y-m-d-His').'.xlsx';

        return Excel::download($export, $filename);
    }

    /**
     * @param  bool  $exportMode  When true, uses `statuses[]` if present; otherwise falls back to `status` like the list.
     */
    private function filteredOrdersQuery(Request $request, bool $exportMode): Builder
    {
        $query = Order::with('product:id,name,new_price,old_price')->orderByDesc('created_at');

        if ($exportMode && $request->filled('statuses') && is_array($request->statuses)) {
            $statuses = array_values(array_unique($request->statuses));
            if ($statuses !== []) {
                $query->whereIn('status', $statuses);
            }
        } elseif (! $exportMode && $request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } elseif ($exportMode && $request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $term = '%'.$request->search.'%';
            $query->where(function ($q) use ($term) {
                $q->where('customer_name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('phone', 'like', $term)
                    ->orWhereHas('product', fn ($q) => $q->where('name', 'like', $term));
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return $query;
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,paid,sold,refund',
        ]);

        $order->update(['status' => $validated['status']]);

        return back();
    }

    public function previewStatusEmail(Request $request, Order $order)
    {
        $status = $request->query('status', $order->status);
        $allowed = [Order::STATUS_CONFIRMED, Order::STATUS_PAID, Order::STATUS_SOLD, Order::STATUS_REFUND];
        if (! in_array($status, $allowed, true)) {
            abort(404);
        }

        $mailable = new OrderStatusNotificationMail($order, $status);
        $html = $mailable->render();

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    public function sendStatusNotification(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:confirmed,paid,sold,refund',
        ]);

        try {
            Mail::to($order->email)->send(new OrderStatusNotificationMail($order, $validated['status']));
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Impossible d’envoyer l’email.');
        }

        return back()->with('success', 'Email envoyé au client.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return back()->with('success', 'Commande supprimée.');
    }
}
