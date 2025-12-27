<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignUuid('coach_id')->nullable()->constrained('staff')->onDelete('set null');
            $table->dateTime('scheduled_at');
            $table->string('location');
            $table->text('objectives')->nullable();
            $table->integer('rpe')->nullable(); // Rate of Perceived Exertion (1-10)
            $table->text('coach_notes')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['team_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
