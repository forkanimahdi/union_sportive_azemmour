@extends('emails.layouts.club')

@section('title', 'Confirmation de commande')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
        $unitPrice = (float) ($order->product?->new_price ?? $order->product?->old_price ?? 0);
        $subtotal = $unitPrice * (int) $order->quantity;
        $deliveryFee = (float) ($order->delivery_fee ?? 0);
        $totalToPay = $subtotal + $deliveryFee;
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Nous vous remercions pour votre commande. Elle a bien été enregistrée et est en cours de traitement.
    </p>

    <p style="margin:0 0 24px 0;">
        Votre commande est confirmée. Nous vous invitons à régler le montant afin de lancer la préparation et la livraison.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 24px;">
        <tr>
            <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #571123; font-weight: 700;">Récapitulatif</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px;">
                <p style="margin:0 0 8px 0;"><strong>Produit :</strong> {{ $productName }}</p>
                <p style="margin:0 0 8px 0;"><strong>Prix unitaire :</strong> {{ number_format($unitPrice, 0) }} DH</p>
                @if(!empty($order->sizes) && count($order->sizes) === (int) $order->quantity)
                    <p style="margin:0 0 8px 0;"><strong>Tailles :</strong> {{ implode(', ', $order->sizes) }} (par unité)</p>
                @else
                    <p style="margin:0 0 8px 0;"><strong>Taille :</strong> {{ $order->size }}</p>
                @endif
                <p style="margin:0 0 8px 0;"><strong>Quantité :</strong> {{ $order->quantity }}</p>
                <p style="margin:0 0 8px 0;"><strong>Sous-total commande :</strong> {{ number_format($subtotal, 0) }} DH</p>
                <p style="margin:0 0 8px 0;"><strong>Adresse :</strong> {{ $order->address_street }}, {{ $order->address_postal_code }} {{ $order->address_city }}, {{ $order->address_country }}</p>
                @if(isset($order->delivery_fee) && $order->delivery_fee > 0)
                    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> {{ number_format($order->delivery_fee, 0) }} DH</p>
                @elseif(isset($order->delivery_fee))
                    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> Livraison gratuite</p>
                @endif
                <p style="margin:10px 0 0 0; font-size:16px;"><strong>Total à régler :</strong> {{ number_format($totalToPay, 0) }} DH</p>
                @if($order->notes)
                    <p style="margin:8px 0 0 0;"><strong>Vos remarques :</strong> {{ $order->notes }}</p>
                @endif
            </td>
        </tr>
    </table>

    <p style="margin:0; color: #666; font-size: 14px;">
        Pour toute question, n’hésitez pas à nous contacter.
    </p>
@endsection
