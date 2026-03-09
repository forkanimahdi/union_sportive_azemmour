<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 24px;">
    <tr>
        <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #571123; font-weight: 700;">Récapitulatif de la commande</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 16px;">
            <p style="margin:0 0 8px 0;"><strong>Produit :</strong> {{ $order->product?->name ?: 'Produit' }}</p>
            @if(!empty($order->sizes) && count($order->sizes) === (int) $order->quantity)
                <p style="margin:0 0 8px 0;"><strong>Tailles :</strong> {{ implode(', ', $order->sizes) }} (par unité)</p>
            @else
                <p style="margin:0 0 8px 0;"><strong>Taille :</strong> {{ $order->size }}</p>
            @endif
            <p style="margin:0 0 8px 0;"><strong>Quantité :</strong> {{ $order->quantity }}</p>
            @if($order->address_street ?? null)
                <p style="margin:0 0 8px 0;"><strong>Adresse :</strong> {{ $order->address_street }}, {{ $order->address_postal_code ?? '' }} {{ $order->address_city ?? '' }}, {{ $order->address_country ?? '' }}</p>
            @endif
            @if(isset($order->delivery_fee) && $order->delivery_fee > 0)
                <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> {{ number_format($order->delivery_fee, 0) }} DH</p>
            @elseif(isset($order->delivery_fee))
                <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> Livraison gratuite</p>
            @endif
            @if($order->notes ?? null)
                <p style="margin:8px 0 0 0;"><strong>Vos remarques :</strong> {{ $order->notes }}</p>
            @endif
        </td>
    </tr>
</table>

<p style="margin:0; color: #666; font-size: 14px;">
    Pour toute question, n’hésitez pas à nous contacter.
</p>
