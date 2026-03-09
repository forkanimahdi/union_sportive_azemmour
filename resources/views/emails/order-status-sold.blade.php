@extends('emails.layouts.club')

@section('title', 'Commande expédiée')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Bonne nouvelle : votre commande a été <strong>expédiée</strong>.
    </p>

    <p style="margin:0 0 24px 0;">
        Vous devriez la recevoir sous peu. En cas de question ou de problème, n’hésitez pas à nous contacter.
    </p>

    @include('emails.partials.order-recap')
@endsection
