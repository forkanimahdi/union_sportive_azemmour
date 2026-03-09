<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('address_street')->nullable()->after('phone');
            $table->string('address_city')->nullable()->after('address_street');
            $table->string('address_postal_code', 20)->nullable()->after('address_city');
            $table->string('address_country', 100)->nullable()->after('address_postal_code');
            $table->decimal('delivery_fee', 10, 2)->nullable()->after('notes');
            $table->json('sizes')->nullable()->after('size'); // one size per unit when quantity > 1
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'address_street',
                'address_city',
                'address_postal_code',
                'address_country',
                'delivery_fee',
                'sizes',
            ]);
        });
    }
};
