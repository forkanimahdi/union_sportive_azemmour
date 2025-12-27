<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('image_rights', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('player_id')->constrained('players')->onDelete('cascade');
            $table->enum('consent_status', [
                'non_signe',
                'signe_usage_interne',
                'signe_diffusion_publique'
            ])->default('non_signe');
            $table->string('document_path'); // Signed document
            $table->date('signed_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('signed_by'); // Name of person who signed (player or guardian)
            $table->boolean('is_minor')->default(false);
            $table->string('guardian_name')->nullable();
            $table->string('guardian_signature_path')->nullable(); // For minors
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['player_id', 'consent_status']);
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('image_rights');
    }
};
