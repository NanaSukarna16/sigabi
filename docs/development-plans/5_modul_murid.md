# Rencana Pengembangan: Modul Murid

Modul ini mengelola data murid biMBA, penugasan ke unit, pembimbing (guru/user), dan kategori level murid. Serta membedakan murid reguler (poin) dengan murid khusus (dhuafa, trial, baru).

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\Murid.php`
- **Tabel**: `murid`
- **Fields**: `user_id` (guru), `unit_id`, `kategori_murid_id` (wajib untuk reguler), `nama_murid`, `status`, `jenis_murid` (enum: reguler, dhuafa, trial, baru)
- **Relasi**:
  - `user()` : BelongsTo `User`
  - `unit()` : BelongsTo `Unit`
  - `kategori()` : BelongsTo `KategoriMurid`

### 2. Controller: `App\Http\Controllers\MuridController.php`
- **Metode**:
  - `index()` : List murid dengan relasi guru, unit, dan kategori
  - `store()` / `update()` / `destroy()` : CRUD standar murid (validasi `jenis_murid`, `kategori_murid_id` hanya wajib jika `jenis_murid` adalah `reguler`).

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('murid', MuridController::class);`

### 4. React (Inertia) Pages:
- `resources/js/pages/Murid/Index.tsx` (Table murid beserta badge Jenis Murid)
- `resources/js/pages/Murid/Form.tsx` (Form tambah/edit murid dengan dropdown Jenis Murid; menonaktifkan dropdown kategori jika memilih dhuafa/trial/baru)
