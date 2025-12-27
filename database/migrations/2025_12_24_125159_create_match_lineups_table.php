<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_lineups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('match_id')->constrained('matches')->onDelete('cascade');
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->enum('position', ['titulaire', 'remplacante'])->default('titulaire');
            $table->integer('jersey_number')->nullable();
            $table->integer('starting_position')->nullable(); // 1-11 for starting XI
            $table->timestamps();
            
            $table->unique(['match_id', 'player_id']);
            $table->index(['match_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_lineups');
    }
};
