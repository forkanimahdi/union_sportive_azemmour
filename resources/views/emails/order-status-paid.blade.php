@extends('emails.layouts.club')

@section('title', 'Paiement reçu')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Nous vous confirmons la réception de votre <strong>paiement</strong>.
    </p>

    <p style="margin:0 0 24px 0;">
        Votre commande va être préparée et expédiée dans les meilleurs délais. Vous recevrez une notification dès l’expédition.
    </p>

    @include('emails.partials.order-recap')
@endsection
