<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opponent_teams', function (Blueprint $table) {
            $table->enum('category', ['U13', 'U15', 'U17', 'Senior'])->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('opponent_teams', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
