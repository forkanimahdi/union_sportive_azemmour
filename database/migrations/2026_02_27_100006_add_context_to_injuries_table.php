<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('injuries', function (Blueprint $table) {
            $table->foreignUuid('match_id')->nullable()->after('player_id')->constrained('matches')->onDelete('set null');
            $table->foreignUuid('training_id')->nullable()->after('match_id')->constrained('trainings')->onDelete('set null');
            $table->foreignUuid('concentration_day_id')->nullable()->after('training_id')->constrained('concentration_days')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('injuries', function (Blueprint $table) {
            $table->dropForeign(['match_id']);
            $table->dropForeign(['training_id']);
            $table->dropForeign(['concentration_day_id']);
        });
    }
};
