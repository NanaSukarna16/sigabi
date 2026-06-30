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
        Schema::create('penggajian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->integer('bulan');
            $table->integer('tahun');
            $table->decimal('gaji_pokok', 12, 2)->default(0);
            $table->decimal('tunjangan_kesehatan', 12, 2)->default(0);
            $table->decimal('tunjangan_transport', 12, 2)->default(0);
            $table->decimal('tunjangan_kerajinan', 12, 2)->default(0);
            $table->decimal('gaji_progress', 12, 2)->default(0);
            $table->decimal('total_potongan', 12, 2)->default(0);
            $table->decimal('total_gaji', 12, 2);
            $table->string('status', 20)->default('draft');
            $table->timestamps();

            $table->unique(['user_id', 'bulan', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penggajian');
    }
};
