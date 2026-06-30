# Rencana Pengembangan: Modul Kehadiran Guru

Modul ini mencatat kehadiran bulanan dari masing-masing guru yang akan digunakan sebagai dasar pemotongan gaji jika ada ketidakhadiran atau keterlambatan.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\Kehadiran.php`
- **Tabel**: `kehadiran`
- **Fields**: `user_id`, `bulan` (1-12), `tahun`, `jumlah_hadir`, `jumlah_tidak_hadir`, `jumlah_telat`, `persentase_kehadiran`
- **Relasi**:
  - `user()` : BelongsTo `User`

### 2. Controller: `App\Http\Controllers\KehadiranController.php`
- **Metode**:
  - `index()` : Rekap kehadiran dengan filter bulan & tahun
  - `store()` / `update()` : Menyimpan atau memperbarui data jumlah kehadiran guru

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('kehadiran', KehadiranController::class)->only(['index', 'store']);`

### 4. React (Inertia) Pages:
- `resources/js/pages/Kehadiran/Index.tsx` (Form input tabular untuk menginput kehadiran semua guru sekaligus berdasarkan bulan/tahun yang dipilih)
