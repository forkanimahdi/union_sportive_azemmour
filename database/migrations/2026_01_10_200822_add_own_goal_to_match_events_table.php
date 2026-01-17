<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify enum to include own_goal
        DB::statement("ALTER TABLE match_events MODIFY COLUMN type ENUM('goal', 'yellow_card', 'red_card', 'substitution', 'injury', 'penalty', 'missed_penalty', 'own_goal') NOT NULL");
    }

    public function down(): void
    {
        // Revert to original enum
        DB::statement("ALTER TABLE match_events MODIFY COLUMN type ENUM('goal', 'yellow_card', 'red_card', 'substitution', 'injury', 'penalty', 'missed_penalty') NOT NULL");
    }
};
