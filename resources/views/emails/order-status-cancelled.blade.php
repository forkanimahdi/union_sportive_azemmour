@extends('emails.layouts.club')

@section('title', 'Commande annulée')

@section('content')
    @php
        $customerName = $order->customer_name ?: 'Client';
    @endphp

    <p style="margin:0 0 20px 0; font-size: 16px; font-weight: 600; color:#171717;">
        Bonjour {{ $customerName }},
    </p>

    <p style="margin:0 0 20px 0;">
        Nous vous informons que votre commande a été <strong>annulée</strong>. Les articles concernés ont été remis en stock.
    </p>

    <p style="margin:0 0 24px 0;">
        Si un paiement avait été engagé, nous vous contacterons pour les modalités de remboursement le cas échéant.
    </p>

    @include('emails.partials.order-recap')
@endsection
