<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->onDelete('cascade');
            $table->string('customer_name')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('size', 20); // S, M, L, XL, XXL, etc.
            $table->unsignedInteger('quantity')->default(1);
            $table->string('status', 30)->default('pending'); // pending, confirmed, paid, sold, refund
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
