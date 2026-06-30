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
        Schema::create('detail_potongan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penggajian_id')->nullable()->constrained('penggajian')->onDelete('cascade');
            $table->foreignId('aturan_potongan_id')->nullable()->constrained('aturan_potongan')->onDelete('cascade');
            $table->integer('jumlah_hari');
            $table->decimal('total_potongan', 12, 2);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_potongan');
    }
};
