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

    @include('emails.partials.order-recap')
@endsection
