<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('convocation_players', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('convocation_id')->constrained('convocations')->onDelete('cascade');
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->enum('status', ['selected', 'reserve', 'blocked'])->default('selected');
            $table->text('block_reason')->nullable(); // Why player is blocked (injured, suspended, etc.)
            $table->enum('response', ['pending', 'confirmed', 'declined'])->default('pending');
            $table->timestamps();
            
            $table->unique(['convocation_id', 'player_id']);
            $table->index(['player_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('convocation_players');
    }
};
