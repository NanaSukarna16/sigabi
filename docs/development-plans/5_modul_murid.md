# Rencana Pengembangan: Modul Murid

Modul ini mengelola data murid biMBA, penugasan ke unit, pembimbing (guru/user), dan kategori level murid.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\Murid.php`
- **Tabel**: `murid`
- **Fields**: `user_id` (guru pembimbing), `unit_id`, `kategori_murid_id`, `nama_murid`, `status`
- **Relasi**:
  - `user()` : BelongsTo `User` (guru)
  - `unit()` : BelongsTo `Unit`
  - `kategori()` : BelongsTo `KategoriMurid`

### 2. Controller: `App\Http\Controllers\MuridController.php`
- **Metode**:
  - `index()` : List murid dengan relasi guru, unit, dan kategori
  - `store()` / `update()` / `destroy()` : CRUD standar murid

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('murid', MuridController::class);`

### 4. React (Inertia) Pages:
- `resources/js/pages/Murid/Index.tsx` (Table murid beserta filter dropdown unit & guru)
- `resources/js/pages/Murid/Form.tsx` (Form tambah/edit murid dengan select dropdown guru, unit, dan kategori murid)
