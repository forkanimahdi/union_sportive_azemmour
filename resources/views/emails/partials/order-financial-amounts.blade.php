@php
    $f = $order->financialSummary();
    $totalVerb = $totalVerb ?? 'régler';
@endphp
<p style="margin:0 0 8px 0;"><strong>Sous-total articles :</strong> {{ number_format($f['gross_subtotal'], 0) }} DH</p>
@if($f['volume_discount'] > 0)
    <p style="margin:0 0 8px 0;"><strong>Remise volume (à partir de {{ $f['volume_discount_min_quantity'] }} articles) :</strong> −{{ number_format($f['volume_discount'], 0) }} DH</p>
@endif
<p style="margin:0 0 8px 0;"><strong>Sous-total après remise :</strong> {{ number_format($f['product_subtotal'], 0) }} DH</p>
@if($f['delivery_fee'] > 0)
    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> {{ number_format($f['delivery_fee'], 0) }} DH</p>
@else
    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> Livraison gratuite</p>
@endif
<p style="margin:10px 0 0 0; font-size:16px;"><strong>Total à {{ $totalVerb }} :</strong> {{ number_format($f['total'], 0) }} DH</p>
