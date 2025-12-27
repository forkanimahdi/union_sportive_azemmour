<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('season_id')->constrained('seasons')->onDelete('cascade');
            $table->string('name'); // e.g., "Championnat Régional", "Coupe du Maroc"
            $table->enum('type', ['championnat', 'coupe', 'amical', 'tournoi']);
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};
