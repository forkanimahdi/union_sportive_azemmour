@php
    $f = $financial;
    $sizesDisplay = '';
    if (!empty($order->sizes) && is_array($order->sizes) && count($order->sizes) === (int) $order->quantity) {
        $sizesDisplay = implode(', ', $order->sizes);
    } else {
        $sizesDisplay = (string) ($order->size ?? '–');
    }
@endphp
@php
    $h = $half ?? $quadrant ?? ['label' => '', 'hint' => ''];
@endphp
<div style="border-bottom: 2px solid #571123; margin-bottom: 3mm; padding-bottom: 2mm;">
    <div style="font-size: 8pt; color: #666;">{{ $h['label'] }}</div>
    <div style="font-size: 7pt; color: #888; margin-top: 0.5mm;">{{ $h['hint'] }}</div>
</div>
<div style="font-weight: bold; font-size: 11pt; margin-bottom: 2mm; text-transform: uppercase;">Commande payée</div>
<div style="font-size: 8pt; line-height: 1.35;">
    <div><strong>N°</strong> {{ \Illuminate\Support\Str::limit($order->id, 13, '') }}</div>
    <div><strong>Date</strong> {{ $order->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i') }}</div>
    <div style="margin-top: 2mm;"><strong>Produit</strong><br>{{ $order->product?->name ?? '–' }}</div>
    <div><strong>Qté</strong> {{ $order->quantity }} &nbsp;|&nbsp; <strong>Tailles</strong> {{ $sizesDisplay }}</div>
    <div style="margin-top: 2mm;"><strong>Client</strong> {{ $order->customer_name ?: '—' }}</div>
    <div><strong>Tél.</strong> {{ $order->phone }}</div>
    <div><strong>Email</strong> {{ $order->email }}</div>
    <div style="margin-top: 2mm;"><strong>Livraison</strong><br>
        {{ $order->address_street }}, {{ $order->address_postal_code }} {{ $order->address_city }}, {{ $order->address_country }}
    </div>
    <div style="margin-top: 2mm; border-top: 1px solid #ddd; padding-top: 2mm;">
        <strong>Total TTC</strong> {{ number_format($f['total'], 0, ',', ' ') }} DH
        @if($f['volume_discount'] > 0)
            <span style="font-size: 7pt;"> (remise volume −{{ number_format($f['volume_discount'], 0, ',', ' ') }} DH)</span>
        @endif
    </div>
    @if($order->notes)
        <div style="margin-top: 2mm; font-size: 7pt;"><strong>Notes</strong> {{ \Illuminate\Support\Str::limit($order->notes, 200) }}</div>
    @endif
</div>
<div style="margin-top: 3mm; font-size: 6.5pt; color: #999; text-align: center;">Découpe horizontale au milieu de la page — Union Sportive Azemmour</div>
