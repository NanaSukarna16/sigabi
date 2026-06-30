# Rencana Pengembangan: Modul Kehadiran Guru [SELESAI]

Modul ini mencatat kehadiran bulanan dari masing-masing guru yang akan digunakan sebagai dasar pemotongan gaji jika ada ketidakhadiran atau keterlambatan. Seluruh komponen fungsional telah selesai diimplementasikan.

## Komponen yang Telah Dibuat:

### 1. Model: `App\Models\Kehadiran.php` [SELESAI]
- **Tabel**: `kehadiran`
- **Fields**: `user_id`, `bulan` (1-12), `tahun`, `jumlah_hadir`, `jumlah_tidak_hadir`, `jumlah_telat`, `persentase_kehadiran`
- **Relasi**:
  - `user()` : BelongsTo `User`

### 2. Controller: `App\Http\Controllers\KehadiranController.php` [SELESAI]
- **Metode**:
  - `index()` : Rekap kehadiran dengan filter bulan & tahun, memuat seluruh guru aktif.
  - `store()` : Menyimpan atau memperbarui data kehadiran guru bulanan secara bulk (sekaligus banyak), dilengkapi perhitungan persentase otomatis.

### 3. Route: `routes/web.php` [SELESAI]
- **Definisi**: `Route::resource('kehadiran', KehadiranController::class)->only(['index', 'store']);` terdaftar di dalam grup auth.

### 4. React (Inertia) Pages: `resources/js/pages/Kehadiran/Index.tsx` [SELESAI]
- **UI**:
  - Form input tabular (bulk entry) untuk memasukkan data kehadiran seluruh guru secara efisien.
  - Filter interaktif berbasis dropdown Bulan dan Tahun.
