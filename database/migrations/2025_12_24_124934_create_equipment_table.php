<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g., "Maillot domicile", "Ballon officiel"
            $table->string('category'); // e.g., "maillot", "ballon", "equipement"
            $table->text('description')->nullable();
            $table->integer('quantity_total');
            $table->integer('quantity_available')->default(0);
            $table->string('size')->nullable(); // For jerseys, etc.
            $table->string('brand')->nullable();
            $table->string('reference')->nullable();
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->enum('condition', ['neuf', 'bon_etat', 'usage', 'a_remplacer'])->default('neuf');
            $table->foreignUuid('responsible_staff_id')->nullable()->constrained('staff')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['category', 'quantity_available']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
