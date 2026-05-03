@extends('emails.layouts.club')

@section('title', 'Commande confirmée')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
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
                <p style="margin:0 0 8px 0;"><strong>Produit :</strong> {{ $productName }}</p>
                @if(!empty($order->sizes) && count($order->sizes) === (int) $order->quantity)
                    <p style="margin:0 0 8px 0;"><strong>Tailles :</strong> {{ implode(', ', $order->sizes) }} (par unité)</p>
                @else
                    <p style="margin:0 0 8px 0;"><strong>Taille :</strong> {{ $order->size }}</p>
                @endif
                <p style="margin:0 0 8px 0;"><strong>Quantité :</strong> {{ $order->quantity }}</p>
                @include('emails.partials.order-financial-amounts', ['totalVerb' => 'payer'])
            </td>
        </tr>
    </table>

    @if($order->address_street ?? null)
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 24px;">
            <tr>
                <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #571123; font-weight: 700;">Livraison</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px;">
                    <p style="margin:0;"><strong>Adresse :</strong> {{ $order->address_street }}, {{ $order->address_postal_code ?? '' }} {{ $order->address_city ?? '' }}, {{ $order->address_country ?? '' }}</p>
                    @if($order->notes ?? null)
                        <p style="margin:8px 0 0 0;"><strong>Vos remarques :</strong> {{ $order->notes }}</p>
                    @endif
                </td>
            </tr>
        </table>
    @elseif($order->notes ?? null)
        <p style="margin:0 0 16px 0;"><strong>Vos remarques :</strong> {{ $order->notes }}</p>
    @endif

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
