<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignUuid('staff_id')->constrained('staff')->onDelete('cascade');
            $table->enum('role', [
                'head_coach',
                'assistant_coach',
                'goalkeeper_coach',
                'physiotherapist',
                'doctor',
                'equipment_manager'
            ]);
            $table->boolean('is_primary')->default(false); // Primary coach for the team
            $table->date('assigned_from')->nullable();
            $table->date('assigned_until')->nullable();
            $table->timestamps();
            
            $table->unique(['team_id', 'staff_id', 'role']);
            $table->index(['team_id', 'is_primary']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_staff');
    }
};
