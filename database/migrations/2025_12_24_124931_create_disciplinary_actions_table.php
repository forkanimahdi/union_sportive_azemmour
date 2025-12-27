<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disciplinary_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->foreignUuid('match_id')->nullable()->constrained('matches')->onDelete('set null');
            $table->enum('card_type', ['yellow', 'red'])->nullable();
            $table->integer('suspension_matches')->default(0);
            $table->date('suspension_start_date')->nullable();
            $table->date('suspension_end_date')->nullable();
            $table->text('reason')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['player_id', 'is_active']);
            $table->index('suspension_end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disciplinary_actions');
    }
};
