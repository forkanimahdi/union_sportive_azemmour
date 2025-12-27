<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('injuries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->foreignUuid('reported_by')->nullable()->constrained('staff')->onDelete('set null');
            $table->string('type'); // e.g., "Entorse cheville", "Fracture", etc.
            $table->text('description');
            $table->date('injury_date');
            $table->enum('severity', ['legere', 'moderee', 'grave'])->default('legere');
            $table->enum('status', ['en_soins', 'reprise_progressive', 'apte'])->default('en_soins');
            $table->date('estimated_recovery_date')->nullable();
            $table->date('actual_recovery_date')->nullable();
            $table->boolean('fit_to_play')->default(false);
            $table->foreignUuid('validated_by')->nullable()->constrained('staff')->onDelete('set null'); // Physiotherapist validation
            $table->timestamp('validated_at')->nullable();
            $table->text('medical_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['player_id', 'status']);
            $table->index('fit_to_play');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('injuries');
    }
};
