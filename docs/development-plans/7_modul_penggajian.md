# Rencana Pengembangan: Modul Penggajian (Core)

Modul core untuk memproses perhitungan gaji kotor, potongan ketidakhadiran, insentif poin progress belajar murid, hingga mencetak slip gaji bulanan.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Models:
- **`App\Models\Penggajian.php`**: Menyimpan total gaji, potongan, dan tunjangan per bulan.
- **`App\Models\DetailProgress.php`**: Mencatat poin progress per murid bimbingan guru yang dihitung menjadi insentif tambahan.
- **`App\Models\DetailPotongan.php`**: Mencatat rincian potongan berdasarkan hari tidak hadir atau terlambat.

### 2. Controller: `App\Http\Controllers\PenggajianController.php`
- **Metode**:
  - `index()` : Riwayat penggajian bulanan
  - `calculate(Request $request)` : Menghitung gaji otomatis berdasarkan rumus:
    - *Gaji Kotor* = Gaji Pokok + Tunjangan (Kesehatan + Transport + Kerajinan) + (Total Poin Murid Bimbingan x Poin Progress Kategori)
    - *Potongan* = (Jumlah Tidak Hadir/Telat x Nominal Aturan Potongan)
    - *Gaji Bersih* = Gaji Kotor - Total Potongan
  - `store()` : Menyimpan hasil perhitungan gaji
  - `show($id)` : Detail slip gaji bulanan guru
  - `exportPdf($id)` : Unduh slip gaji dalam format PDF

### 3. Route: `routes/web.php`
- **Definisi**:
  - `Route::get('penggajian', [PenggajianController::class, 'index'])->name('penggajian.index');`
  - `Route::post('penggajian/calculate', [PenggajianController::class, 'calculate'])->name('penggajian.calculate');`
  - `Route::post('penggajian', [PenggajianController::class, 'store'])->name('penggajian.store');`
  - `Route::get('penggajian/{id}', [PenggajianController::class, 'show'])->name('penggajian.show');`
  - `Route::get('penggajian/{id}/pdf', [PenggajianController::class, 'exportPdf'])->name('penggajian.pdf');`

### 4. React (Inertia) Pages:
- `resources/js/pages/Penggajian/Index.tsx` (Daftar riwayat gaji bulanan guru)
- `resources/js/pages/Penggajian/Calculate.tsx` (Wizard form untuk memilih bulan/tahun dan menampilkan kalkulasi gaji sebelum disimpan)
- `resources/js/pages/Penggajian/Slip.tsx` (Tampilan slip gaji rapi & tombol cetak PDF)
