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
        Schema::create('kategori_murid', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kategori', 10)->unique();
            $table->string('nama_kategori', 50)->nullable();
            $table->decimal('poin_progress', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kategori_murid');
    }
};
