<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE staff MODIFY COLUMN role VARCHAR(50) NOT NULL");
            DB::statement("ALTER TABLE team_staff MODIFY COLUMN role VARCHAR(50) NOT NULL");
        }
        // SQLite: enum is stored as varchar, no change needed for new values
    }

    public function down(): void
    {
        // Restoring enum would require knowing previous values; leave as string
    }
};
