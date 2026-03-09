<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $status
    ) {
        $this->order->load('product');
    }

    public function envelope(): Envelope
    {
        $subjects = [
            Order::STATUS_CONFIRMED => 'Votre commande est confirmée – Union Sportive Azemmour',
            Order::STATUS_PAID      => 'Paiement reçu – Union Sportive Azemmour',
            Order::STATUS_SOLD      => 'Votre commande a été expédiée – Union Sportive Azemmour',
            Order::STATUS_REFUND    => 'Remboursement de votre commande – Union Sportive Azemmour',
        ];
        $subject = $subjects[$this->status] ?? 'Mise à jour de votre commande – Union Sportive Azemmour';

        return new Envelope(
            subject: $subject,
            replyTo: [config('mail.from.address')],
        );
    }

    public function content(): Content
    {
        $views = [
            Order::STATUS_CONFIRMED => 'emails.order-status-confirmed',
            Order::STATUS_PAID      => 'emails.order-status-paid',
            Order::STATUS_SOLD      => 'emails.order-status-sold',
            Order::STATUS_REFUND    => 'emails.order-status-refund',
        ];
        $view = $views[$this->status] ?? 'emails.order-status-confirmed';

        return new Content(view: $view);
    }
}
