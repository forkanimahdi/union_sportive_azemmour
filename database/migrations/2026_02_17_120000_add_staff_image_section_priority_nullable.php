<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->string('image')->nullable()->after('phone');
            $table->string('section')->nullable()->after('role'); // bureau, coach, soigneur, other
            $table->unsignedInteger('priority')->nullable()->after('section'); // display order (asc)
        });
    }

    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn(['image', 'section', 'priority']);
        });
    }
};
