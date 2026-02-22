<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            return;
        }

        if (!Schema::hasTable('staff')) {
            return;
        }

        $info = DB::select("PRAGMA table_info('staff')");
        $idCol = collect($info)->firstWhere('name', 'id');
        $isPk = (int)($idCol->pk ?? 0) === 1;
        if ($isPk) {
            return;
        }

        // SQLite: rebuild table to add PRIMARY KEY on id.
        DB::statement('PRAGMA foreign_keys=OFF');

        Schema::create('staff_tmp', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedBigInteger('user_id')->nullable();

            // Make everything nullable (as requested)
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('image')->nullable();
            $table->string('role')->nullable();
            $table->text('specialization')->nullable();
            $table->string('license_number')->nullable();
            $table->date('hire_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('section')->nullable();
            $table->unsignedInteger('priority')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        // Copy data (columns may already exist depending on previous migrations)
        DB::statement("
            INSERT INTO staff_tmp (
                id, user_id, first_name, last_name, email, phone, image, role, specialization, license_number, hire_date,
                is_active, section, priority, created_at, updated_at, deleted_at
            )
            SELECT
                id, user_id, first_name, last_name, email, phone,
                COALESCE(image, NULL) as image,
                role, specialization, license_number, hire_date,
                COALESCE(is_active, 1) as is_active,
                COALESCE(section, NULL) as section,
                COALESCE(priority, NULL) as priority,
                created_at, updated_at, deleted_at
            FROM staff
        ");

        Schema::drop('staff');
        Schema::rename('staff_tmp', 'staff');

        DB::statement('PRAGMA foreign_keys=ON');
    }

    public function down(): void
    {
        // Irreversible on purpose.
    }
};

