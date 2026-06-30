# Rencana Pengembangan: Modul Guru & Staff (Users)

Modul ini mengelola data guru, kepala unit, dan superadmin beserta info gaji pokok & tunjangan.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\User.php`
- **Fields**: `unit_id`, `nama`, `email`, `password`, `no_hp`, `alamat`, `role` (superadmin/guru/kepala_unit), `gaji_pokok`, `tunjangan_kesehatan`, `tunjangan_transport`, `tunjangan_kerajinan`, `status` (aktif/nonaktif)
- **Relasi**:
  - `unit()` : BelongsTo `Unit`
  - `murid()` : HasMany `Murid`
  - `kehadiran()` : HasMany `Kehadiran`
  - `penggajian()` : HasMany `Penggajian`

### 2. Controller: `App\Http\Controllers\UserController.php`
- **Metode**:
  - `index()` : Menampilkan daftar guru/staff beserta relasi `unit`
  - `store()` : Mendaftarkan user baru dengan enkripsi password
  - `update()` : Memperbarui data profil, unit penugasan, dan detail gaji/tunjangan
  - `destroy()` : Menonaktifkan atau menghapus user

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('users', UserController::class);`

### 4. React (Inertia) Pages:
- `resources/js/pages/Users/Index.tsx` (Tabel daftar pengguna dengan badge Role & Status)
- `resources/js/pages/Users/Form.tsx` (Form pembuatan/pembaruan data guru lengkap dengan nominal gaji/tunjangan)
