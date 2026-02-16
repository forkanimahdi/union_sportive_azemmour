@extends('emails.layouts.club')

@section('title', 'Confirmation de commande')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Nous vous remercions pour votre commande. Elle a bien été enregistrée et est en cours de traitement.
    </p>

    <p style="margin:0 0 24px 0;">
        <strong>Nous reviendrons vers vous très prochainement</strong> pour finaliser la livraison et le paiement.
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
                <p style="margin:0 0 8px 0;"><strong>Taille :</strong> {{ $order->size }}</p>
                <p style="margin:0 0 8px 0;"><strong>Quantité :</strong> {{ $order->quantity }}</p>
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
