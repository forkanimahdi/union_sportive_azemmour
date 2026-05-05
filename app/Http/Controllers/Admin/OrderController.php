<?php

namespace App\Http\Controllers\Admin;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Mail\OrderStatusNotificationMail;
use App\Models\Order;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class OrderController extends Controller
{
    private function orderToArray(Order $o): array
    {
        $o->loadMissing('product');

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
            'volume_discount' => $o->volume_discount !== null ? (float) $o->volume_discount : 0.0,
            'financial' => $o->financialSummary(),
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
            'status' => 'nullable|string|in:all,pending,confirmed,paid,sold,refund,cancelled',
            'statuses' => 'nullable|array',
            'statuses.*' => 'string|in:pending,confirmed,paid,sold,refund,cancelled',
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
            'status' => 'required|string|in:pending,confirmed,paid,sold,refund,cancelled',
        ]);

        $newStatus = $validated['status'];

        $openPaidPdfOrderId = null;
        $previousStatus = null;

        DB::transaction(function () use ($order, $newStatus, &$openPaidPdfOrderId, &$previousStatus) {
            $locked = Order::query()->whereKey($order->getKey())->lockForUpdate()->firstOrFail();
            $prev = $locked->status;
            $previousStatus = $prev;

            $shouldReleaseStock = $locked->inventory_deducted
                && $locked->product_id
                && (
                    ($newStatus === Order::STATUS_REFUND && $prev !== Order::STATUS_REFUND)
                    || ($newStatus === Order::STATUS_CANCELLED && $prev !== Order::STATUS_CANCELLED)
                );

            if ($shouldReleaseStock) {
                $product = Product::query()->whereKey($locked->product_id)->lockForUpdate()->first();
                if ($product) {
                    $product->incrementStockForSizes($locked->sizeCountsForInventory());
                }
                $locked->inventory_deducted = false;
            }

            $locked->status = $newStatus;
            $locked->save();

            if ($newStatus === Order::STATUS_PAID && $prev !== Order::STATUS_PAID) {
                $openPaidPdfOrderId = $locked->id;
            }
        });

        $order->refresh();

        $notifiableStatuses = [
            Order::STATUS_CONFIRMED,
            Order::STATUS_PAID,
            Order::STATUS_SOLD,
            Order::STATUS_REFUND,
            Order::STATUS_CANCELLED,
        ];

        $shouldEmailCustomer = $previousStatus !== $newStatus
            && in_array($newStatus, $notifiableStatuses, true)
            && filled($order->email);

        $emailError = null;
        if ($shouldEmailCustomer) {
            try {
                Mail::to($order->email)->send(new OrderStatusNotificationMail($order, $newStatus));
            } catch (\Throwable $e) {
                report($e);
                $emailError = 'Impossible d’envoyer l’email au client.';
            }
        }

        if ($openPaidPdfOrderId !== null) {
            $response = back()
                ->with('open_order_paid_pdf', route('admin.orders.paid-tickets-pdf', ['order' => $openPaidPdfOrderId], false))
                ->with('success', 'Commande passée en « Payée ». Le PDF (1 page A4, 2 parties haut/bas) s’ouvre dans un nouvel onglet — autorisez les pop-ups si besoin.');

            return $emailError ? $response->with('error', $emailError) : $response;
        }

        if ($emailError) {
            return back()->with('error', $emailError);
        }

        return back();
    }

    /**
     * Une page A4 : deux bandes (haut / bas), même contenu — découpe horizontale au milieu.
     */
    public function paidTicketsPdf(Order $order)
    {
        abort_unless(in_array($order->status, [Order::STATUS_PAID, Order::STATUS_SOLD], true), 404);

        $order->loadMissing('product');
        $financial = $order->financialSummary();
        $halves = [
            ['label' => 'Partie haute — Exemplaire 1/2', 'hint' => 'Ex. atelier, livreur ou colis — découper au trait pointillé ci-dessous'],
            ['label' => 'Partie basse — Exemplaire 2/2', 'hint' => 'Ex. archives, caisse ou second colis — même contenu que la partie haute'],
        ];

        $pdf = Pdf::loadView('pdf.order-paid-tickets', compact('order', 'financial', 'halves'))
            ->setPaper('a4', 'portrait');

        $short = substr(str_replace('-', '', $order->id), 0, 8);

        return $pdf->download('bordereau-commande-'.$short.'.pdf');
    }

    public function previewStatusEmail(Request $request, Order $order)
    {
        $status = $request->query('status', $order->status);
        $allowed = [Order::STATUS_CONFIRMED, Order::STATUS_PAID, Order::STATUS_SOLD, Order::STATUS_REFUND, Order::STATUS_CANCELLED];
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
            'status' => 'required|string|in:confirmed,paid,sold,refund,cancelled',
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
        DB::transaction(function () use ($order) {
            $locked = Order::query()->whereKey($order->getKey())->lockForUpdate()->firstOrFail();

            if ($locked->inventory_deducted && $locked->product_id) {
                $product = Product::query()->whereKey($locked->product_id)->lockForUpdate()->first();
                if ($product) {
                    $product->incrementStockForSizes($locked->sizeCountsForInventory());
                }
            }

            $locked->delete();
        });

        return back()->with('success', 'Commande supprimée.');
    }
}
