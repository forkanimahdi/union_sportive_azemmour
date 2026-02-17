<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('team_staff') || !Schema::hasColumn('team_staff', 'id')) {
            return;
        }

        Schema::create('team_staff_tmp', function (Blueprint $table) {
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignUuid('staff_id')->constrained('staff')->onDelete('cascade');
            $table->string('role')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->date('assigned_from')->nullable();
            $table->date('assigned_until')->nullable();
            $table->timestamps();

            $table->unique(['team_id', 'staff_id', 'role']);
            $table->index(['team_id', 'is_primary']);
        });

        DB::statement("
            INSERT INTO team_staff_tmp (team_id, staff_id, role, is_primary, assigned_from, assigned_until, created_at, updated_at)
            SELECT team_id, staff_id, role, is_primary, assigned_from, assigned_until, created_at, updated_at
            FROM team_staff
        ");

        Schema::drop('team_staff');
        Schema::rename('team_staff_tmp', 'team_staff');
    }

    public function down(): void
    {
        // Irreversible on purpose.
    }
};

