@extends('emails.layouts.club')

@section('title', 'Remboursement')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
        $productName = $order->product?->name ?: 'Produit';
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Nous vous confirmons que votre commande a été traitée en <strong>remboursement</strong>.
    </p>

    <p style="margin:0 0 24px 0;">
        Le montant sera recrédité selon les délais de votre établissement bancaire. Pour toute question, n’hésitez pas à nous contacter.
    </p>

    @include('emails.partials.order-recap')
@endsection
