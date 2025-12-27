<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('convocations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->enum('type', ['match', 'training', 'stage']);
            $table->foreignUuid('match_id')->nullable()->constrained('matches')->onDelete('cascade');
            $table->foreignUuid('training_id')->nullable()->constrained('trainings')->onDelete('cascade');
            $table->dateTime('meeting_time');
            $table->string('meeting_location');
            $table->text('instructions')->nullable();
            $table->enum('status', ['draft', 'sent', 'confirmed'])->default('draft');
            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['team_id', 'type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('convocations');
    }
};
