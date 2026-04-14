<?php

namespace App\Exports;

use App\Models\Order;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrdersExport implements FromCollection, WithHeadings, WithMapping
{
    public const COLUMN_LABELS = [
        'id' => 'ID commande',
        'created_at' => 'Date',
        'product_name' => 'Produit',
        'unit_price' => 'Prix unitaire (DH)',
        'quantity' => 'Quantité',
        'subtotal' => 'Sous-total (DH)',
        'delivery_fee' => 'Frais livraison (DH)',
        'total' => 'Total (DH)',
        'customer_name' => 'Nom client',
        'email' => 'Email',
        'phone' => 'Téléphone',
        'address_street' => 'Rue',
        'address_city' => 'Ville',
        'address_postal_code' => 'Code postal',
        'address_country' => 'Pays',
        'sizes' => 'Taille(s)',
        'status' => 'Statut',
        'notes' => 'Notes',
    ];

    /** @param  array<int, string>  $columns */
    public function __construct(
        private Collection $orders,
        private array $columns,
        /** @var array<string, string> */
        private array $statusLabels,
    ) {
        $allowed = array_keys(self::COLUMN_LABELS);
        $filtered = array_values(array_intersect($columns ?: $allowed, $allowed));
        $this->columns = $filtered !== [] ? $filtered : $allowed;
    }

    public function collection(): Collection
    {
        return $this->orders;
    }

    public function headings(): array
    {
        return array_map(fn (string $key) => self::COLUMN_LABELS[$key], $this->columns);
    }

    /**
     * @param  Order  $order
     * @return array<int, mixed>
     */
    public function map($order): array
    {
        $unit = $this->unitPrice($order);
        $qty = (int) $order->quantity;
        $subtotal = $unit * $qty;
        $delivery = (float) ($order->delivery_fee ?? 0);
        $total = $subtotal + $delivery;

        $row = [];
        foreach ($this->columns as $col) {
            $row[] = match ($col) {
                'id' => $order->id,
                'created_at' => $order->created_at?->timezone(config('app.timezone'))->format('Y-m-d H:i'),
                'product_name' => $order->product?->name,
                'unit_price' => round($unit, 2),
                'quantity' => $qty,
                'subtotal' => round($subtotal, 2),
                'delivery_fee' => round($delivery, 2),
                'total' => round($total, 2),
                'customer_name' => $order->customer_name,
                'email' => $order->email,
                'phone' => $order->phone,
                'address_street' => $order->address_street,
                'address_city' => $order->address_city,
                'address_postal_code' => $order->address_postal_code,
                'address_country' => $order->address_country,
                'sizes' => $this->formatSizes($order),
                'status' => $this->statusLabels[$order->status] ?? $order->status,
                'notes' => $order->notes,
                default => '',
            };
        }

        return $row;
    }

    private function unitPrice(Order $order): float
    {
        $p = $order->product;
        if (! $p) {
            return 0.0;
        }

        return (float) ($p->new_price ?? $p->old_price ?? 0);
    }

    private function formatSizes(Order $order): string
    {
        if (is_array($order->sizes) && count($order->sizes) > 0) {
            return implode(', ', $order->sizes);
        }

        return (string) ($order->size ?? '');
    }
}
