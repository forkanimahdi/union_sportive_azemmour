<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            // Add opponent_team_id column
            $table->uuid('opponent_team_id')->nullable()->after('team_id');
            $table->foreign('opponent_team_id')->references('id')->on('opponent_teams')->onDelete('set null');
            
            // Keep opponent string for backward compatibility, but make it nullable
            $table->string('opponent')->nullable()->change();
            
            // Add category field to matches
            $table->string('category')->nullable()->after('opponent');
        });
    }

    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropForeign(['opponent_team_id']);
            $table->dropColumn(['opponent_team_id', 'category']);
            $table->string('opponent')->nullable(false)->change();
        });
    }
};
