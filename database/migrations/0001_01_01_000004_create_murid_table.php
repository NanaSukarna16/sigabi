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
        Schema::create('murid', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->foreignId('kategori_murid_id')->nullable()->constrained('kategori_murid')->onDelete('set null');
            $table->string('nama_murid', 100);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->enum('jenis_murid', ['reguler', 'dhuafa', 'trial', 'baru'])->default('reguler');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('murid');
    }
};
