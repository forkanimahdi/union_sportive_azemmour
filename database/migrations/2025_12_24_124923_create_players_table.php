<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->nullable()->constrained('teams')->onDelete('set null');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->enum('position', [
                'gardien',
                'defenseur',
                'milieu',
                'attaquant',
            ])->nullable();
            $table->enum('preferred_foot', ['gauche', 'droit', 'ambidextre'])->nullable();
            $table->string('jersey_number')->nullable();
            $table->string('photo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            
            // Legal guardian for minors
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();
            $table->string('guardian_relationship')->nullable(); // parent, tuteur, etc.
            
            // Documents
            $table->string('medical_certificate_path')->nullable();
            $table->date('medical_certificate_expiry')->nullable();
            $table->string('parental_authorization_path')->nullable();
            $table->string('license_path')->nullable();
            $table->string('license_number')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['team_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
