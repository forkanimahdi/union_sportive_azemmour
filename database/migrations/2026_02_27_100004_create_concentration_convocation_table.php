<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentration_convocation', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('concentration_id')->constrained('concentrations')->onDelete('cascade');
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->enum('status', ['convoquee', 'presente', 'absente', 'forfait'])->default('convoquee');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['concentration_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentration_convocation');
    }
};
