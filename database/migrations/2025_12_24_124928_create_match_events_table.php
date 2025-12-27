<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('match_id')->constrained('matches')->onDelete('cascade');
            $table->foreignUuid('player_id')->nullable()->constrained('players')->onDelete('set null');
            $table->enum('type', ['goal', 'yellow_card', 'red_card', 'substitution', 'injury', 'penalty', 'missed_penalty']);
            $table->integer('minute');
            $table->text('description')->nullable();
            $table->foreignUuid('substituted_player_id')->nullable()->constrained('players')->onDelete('set null'); // For substitutions
            $table->timestamps();
            
            $table->index(['match_id', 'minute']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_events');
    }
};
