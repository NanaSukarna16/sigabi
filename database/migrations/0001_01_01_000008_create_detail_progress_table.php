<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penggajian_id')->nullable()->constrained('penggajian')->onDelete('cascade');
            $table->foreignId('murid_id')->nullable()->constrained('murid')->onDelete('cascade');
            $table->foreignId('kategori_murid_id')->nullable()->constrained('kategori_murid')->onDelete('cascade');
            $table->decimal('poin_didapat', 8, 2);
            $table->decimal('nominal_insentif', 12, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_progress');
    }
};
