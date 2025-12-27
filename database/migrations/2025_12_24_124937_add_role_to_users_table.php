<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'admin',           // Administrateur club
                'technical_director', // Directeur technique
                'coach',           // Coach
                'physiotherapist',  // Soigneur / Kinésithérapeute
                'communication',    // Responsable communication
                'president',       // Président / Bureau (lecture seule)
            ])->default('coach')->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
