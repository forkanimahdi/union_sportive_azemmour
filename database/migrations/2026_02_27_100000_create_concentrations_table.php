<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('location')->nullable();
            $table->string('accommodation')->nullable();
            $table->enum('objective', ['preparation_match', 'cohesion', 'physique', 'autre'])->default('autre');
            $table->foreignUuid('responsible_id')->nullable()->constrained('staff')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentrations');
    }
};
