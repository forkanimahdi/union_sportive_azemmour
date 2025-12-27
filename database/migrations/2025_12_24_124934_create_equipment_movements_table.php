<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_id')->constrained('equipment')->onDelete('cascade');
            $table->enum('type', ['sortie', 'retour', 'perte', 'dommage', 'ajout']);
            $table->integer('quantity');
            $table->foreignUuid('player_id')->nullable()->constrained('players')->onDelete('set null');
            $table->foreignUuid('team_id')->nullable()->constrained('teams')->onDelete('set null');
            $table->foreignUuid('staff_id')->nullable()->constrained('staff')->onDelete('set null');
            $table->foreignUuid('match_id')->nullable()->constrained('matches')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->foreignUuid('processed_by')->constrained('users')->onDelete('cascade');
            $table->date('expected_return_date')->nullable();
            $table->date('actual_return_date')->nullable();
            $table->timestamps();
            
            $table->index(['equipment_id', 'type']);
            $table->index(['player_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment_movements');
    }
};
