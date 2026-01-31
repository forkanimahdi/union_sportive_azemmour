<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            // Drop the nullable column and recreate as required
            $table->dropForeign(['season_id']);
            $table->dropColumn('season_id');
        });
        
        Schema::table('teams', function (Blueprint $table) {
            // Recreate as required (not nullable)
            $table->foreignUuid('season_id')->after('id')->constrained('seasons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['season_id']);
            $table->dropColumn('season_id');
        });
        
        Schema::table('teams', function (Blueprint $table) {
            // Recreate as nullable for rollback
            $table->foreignUuid('season_id')->nullable()->after('id')->constrained('seasons')->onDelete('cascade');
        });
    }
};
