<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentration_days', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('concentration_id')->constrained('concentrations')->onDelete('cascade');
            $table->date('date');
            $table->text('coach_notes')->nullable();
            $table->timestamps();

            $table->unique(['concentration_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentration_days');
    }
};
