# Rencana Pengembangan: Modul Murid [SELESAI]

Modul ini mengelola data murid biMBA, penugasan ke unit, pembimbing (guru/user), dan kategori level murid. Serta membedakan murid reguler (poin) dengan murid khusus (dhuafa, trial, baru). Seluruh komponen CRUD telah selesai diimplementasikan.

## Komponen yang Telah Dibuat:

### 1. Model: `App\Models\Murid.php` [SELESAI]
- **Tabel**: `murid`
- **Fields**: `user_id` (guru), `unit_id`, `kategori_murid_id` (wajib untuk reguler), `nama_murid`, `status`, `jenis_murid` (enum: reguler, dhuafa, trial, baru)
- **Relasi**:
  - `user()` : BelongsTo `User`
  - `unit()` : BelongsTo `Unit`
  - `kategori()` : BelongsTo `KategoriMurid`

### 2. Controller: `App\Http\Controllers\MuridController.php` [SELESAI]
- **Metode**:
  - `index()` : List murid dengan relasi guru, unit, dan kategori
  - `store()` / `update()` / `destroy()` : CRUD standar murid (validasi `jenis_murid`, `kategori_murid_id` hanya wajib jika `jenis_murid` adalah `reguler`).

### 3. Route: `routes/web.php` [SELESAI]
- **Definisi**: `Route::resource('murid', MuridController::class);` di daftarkan di dalam middleware `auth`.

### 4. React (Inertia) Pages: `resources/js/pages/Murid/Index.tsx` [SELESAI]
- **UI**:
  - Table murid beserta badge Jenis Murid.
  - Form tambah/edit murid dengan dropdown Jenis Murid; menonaktifkan dropdown kategori jika memilih dhuafa/trial/baru.
  - Saringan data (client-side filter) dan dialog konfirmasi hapus data.
