<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('stock_by_size')->nullable()->after('is_active');
        });

        $defaultStock = json_encode(array_fill_keys(['XS', 'S', 'M', 'L', 'XL', 'XXL'], 100));
        DB::table('products')->update(['stock_by_size' => $defaultStock]);

        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('inventory_deducted')->default(false)->after('delivery_fee');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('inventory_deducted');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('stock_by_size');
        });
    }
};
