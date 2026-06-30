# Rencana Pengembangan: Modul Guru & Staff (Users) [SELESAI]

Modul ini mengelola data guru, kepala unit, dan superadmin beserta info gaji pokok & tunjangan. Modul ini telah terintegrasi penuh di bawah satu menu grup **Karyawan**.

## Komponen yang Telah Dibuat / Direvisi:

### 1. Model: `App\Models\User.php` [SELESAI]
- **Fields**: `unit_id`, `name`, `email`, `password`, `no_hp`, `alamat`, `role` (superadmin/guru/kepala_unit), `gaji_pokok`, `tunjangan_kesehatan`, `tunjangan_transport`, `tunjangan_kerajinan`, `status` (aktif/nonaktif)
- **Relasi**:
  - `unit()` : BelongsTo `Unit`
  - `murid()` : HasMany `Murid`
  - `kehadiran()` : HasMany `Kehadiran`
  - `penggajian()` : HasMany `Penggajian`

### 2. Controller: `App\Http\Controllers\UserController.php` [SELESAI]
- **Metode**:
  - `index(Request $request)` : Menampilkan daftar pengguna disaring berdasarkan role `guru` atau `kepala_unit` beserta memuat relasi `unit`
  - `store()` : Menyimpan user karyawan baru dengan password hashing
  - `update()` : Memperbarui data profil karyawan, unit penugasan, dan detail gaji/tunjangan bulanan
  - `destroy()` : Menghapus data karyawan

### 3. Route: `routes/web.php` [SELESAI]
- **Definisi**: `Route::resource('users', UserController::class);` di daftarkan di dalam middleware `auth`.

### 4. React (Inertia) Page: `resources/js/pages/Users/Index.tsx` [SELESAI]
- **Fitur Baru (Revisi)**:
  - **Otomatisasi Role**: Pilihan role dihapus dari form dialog. Form secara otomatis mengisi role berdasarkan context menu yang sedang dibuka (`guru` atau `kepala_unit`).
  - **Detail Karyawan**: Ditambahkan aksi lihat detail karyawan (ikon mata `Eye`) untuk memunculkan modal dialog berisi data profil, penugasan unit, dan rincian nominal tunjangan gaji bulanan terformat rupiah dengan rapi.
  - Tabel data karyawan (Nama, Kontak, Unit, Gaji Pokok, Status).
  - Dialog Form Tambah/Edit Karyawan yang menyatukan input data pribadi, penugasan, dan informasi detail tunjangan penggajian.
  - Saringan otomatis (client-side filter) berdasarkan input teks.
  - Dialog konfirmasi hapus data karyawan.
