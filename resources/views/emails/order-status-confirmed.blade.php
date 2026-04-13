@extends('emails.layouts.club')

@section('title', 'Commande confirmée')

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
        Nous avons bien reçu votre commande et nous vous confirmons qu’elle a été <strong>validée</strong>.
    </p>

    <p style="margin:0 0 24px 0;">
        Prochaine étape : finaliser le paiement selon les modalités qui vous ont été indiquées. Nous restons à votre disposition pour toute question.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 24px;">
        <tr>
            <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #571123; font-weight: 700;">Montant à régler</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px;">
                <p style="margin:0 0 8px 0;"><strong>Sous-total commande :</strong> {{ number_format($subtotal, 0) }} DH</p>
                @if($deliveryFee > 0)
                    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> {{ number_format($deliveryFee, 0) }} DH</p>
                @else
                    <p style="margin:0 0 8px 0;"><strong>Frais de livraison :</strong> Livraison gratuite</p>
                @endif
                <p style="margin:10px 0 0 0; font-size:16px;"><strong>Total à payer :</strong> {{ number_format($totalToPay, 0) }} DH</p>
            </td>
        </tr>
    </table>

    @include('emails.partials.order-recap')

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 24px;">
        <tr>
            <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #571123; font-weight: 700;">Modalités de paiement</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px;">
                <p style="margin:0 0 10px 0;"><strong>👉 Par virement bancaire</strong></p>
                <p style="margin:0 0 6px 0;"><strong>Libellé du compte :</strong> ASSOCIATION CLUB TIHAD AZEMMOUR FEMININ</p>
                <p style="margin:0 0 6px 0;"><strong>RIB :</strong> 050 780 010 01098965 020 01 75</p>
                <p style="margin:0 0 6px 0;"><strong>IBAN :</strong> MA64 050 780 010 01098965 020 01 75</p>
                <p style="margin:0 0 6px 0;"><strong>Banque :</strong> CFG BANK - Agence Palmier</p>
                <p style="margin:0;"><strong>Code BIC / SWIFT :</strong> CAFGMAMCXXX</p>
            </td>
        </tr>
    </table>
@endsection
