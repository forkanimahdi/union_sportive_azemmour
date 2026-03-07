<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->enum('session_type', ['physique', 'tactique', 'technique', 'gardien', 'recuperation'])->nullable()->after('location');
            $table->unsignedSmallInteger('duration_minutes')->nullable()->after('session_type');
            $table->foreignUuid('concentration_day_id')->nullable()->after('team_id')->constrained('concentration_days')->onDelete('cascade');
            $table->enum('time_slot', ['matin', 'apres_midi', 'soir'])->nullable()->after('duration_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->dropForeign(['concentration_day_id']);
            $table->dropColumn(['session_type', 'duration_minutes', 'concentration_day_id', 'time_slot']);
        });
    }
};
