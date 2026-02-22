<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cleanup from any previous failed attempt
        Schema::dropIfExists('player_team_tmp');

        if (!Schema::hasTable('player_team') || !Schema::hasColumn('player_team', 'id')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF');
        }

        Schema::create('player_team_tmp', function (Blueprint $table) {
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['player_id', 'team_id']);
        });

        DB::statement("
            INSERT INTO player_team_tmp (player_id, team_id, is_primary, created_at, updated_at)
            SELECT player_id, team_id, is_primary, created_at, updated_at
            FROM player_team
        ");

        Schema::drop('player_team');
        Schema::rename('player_team_tmp', 'player_team');

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=ON');
        }
    }

    public function down(): void
    {
        // Irreversible on purpose.
    }
};

