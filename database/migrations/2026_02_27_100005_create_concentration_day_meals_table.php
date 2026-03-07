<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentration_day_meals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('concentration_day_id')->constrained('concentration_days')->onDelete('cascade');
            $table->enum('type', ['petit_dejeuner', 'dejeuner', 'diner', 'sieste']);
            $table->enum('time_slot', ['matin', 'apres_midi', 'soir'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentration_day_meals');
    }
};
