<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('season_id')->constrained('seasons')->onDelete('cascade');
            $table->string('category', 20); // Senior, U17, U15
            $table->foreignUuid('team_id')->nullable()->constrained('teams')->onDelete('cascade'); // our USA team
            $table->foreignUuid('opponent_team_id')->nullable()->constrained('opponent_teams')->onDelete('cascade');
            $table->unsignedInteger('matches_played')->default(0);
            $table->unsignedInteger('wins')->default(0);
            $table->unsignedInteger('draws')->default(0);
            $table->unsignedInteger('losses')->default(0);
            $table->unsignedInteger('goals_for')->default(0);
            $table->unsignedInteger('goals_against')->default(0);
            $table->timestamps();

            $table->unique(['season_id', 'category', 'team_id'], 'standings_season_category_team_unique');
            $table->unique(['season_id', 'category', 'opponent_team_id'], 'standings_season_category_opponent_unique');
            $table->index(['season_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standings');
    }
};
