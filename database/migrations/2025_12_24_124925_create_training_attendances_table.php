<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('training_id')->constrained('trainings')->onDelete('cascade');
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->enum('status', ['present', 'absent', 'late', 'excused'])->default('present');
            $table->time('arrival_time')->nullable(); // For late arrivals
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['training_id', 'player_id']);
            $table->index(['player_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_attendances');
    }
};
