<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentration_team', function (Blueprint $table) {
            $table->foreignUuid('concentration_id')->constrained('concentrations')->onDelete('cascade');
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->primary(['concentration_id', 'team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentration_team');
    }
};
