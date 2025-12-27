<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('competition_id')->nullable()->constrained('competitions')->onDelete('set null');
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->string('opponent');
            $table->dateTime('scheduled_at');
            $table->string('venue');
            $table->enum('type', ['domicile', 'exterieur']);
            $table->integer('home_score')->nullable();
            $table->integer('away_score')->nullable();
            $table->enum('status', ['scheduled', 'live', 'finished', 'postponed', 'cancelled'])->default('scheduled');
            $table->text('match_report')->nullable();
            $table->text('coach_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['team_id', 'scheduled_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
