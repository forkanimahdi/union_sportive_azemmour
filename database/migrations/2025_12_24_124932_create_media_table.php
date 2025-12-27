<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->integer('file_size'); // in bytes
            $table->enum('type', ['photo', 'video']);
            $table->enum('category', ['match', 'training', 'portrait', 'event', 'other']);
            $table->foreignUuid('team_id')->nullable()->constrained('teams')->onDelete('cascade');
            $table->foreignUuid('player_id')->nullable()->constrained('players')->onDelete('cascade');
            $table->foreignUuid('match_id')->nullable()->constrained('matches')->onDelete('cascade');
            $table->foreignUuid('training_id')->nullable()->constrained('trainings')->onDelete('cascade');
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->boolean('approved_for_social_media')->default(false);
            $table->foreignUuid('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['team_id', 'category']);
            $table->index(['player_id', 'category']);
            $table->index('approved_for_social_media');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
