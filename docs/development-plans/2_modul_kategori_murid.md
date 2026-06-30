# Rencana Pengembangan: Modul Kategori Murid (Master)

Modul ini digunakan untuk mengelola kategori tingkatan murid reguler beserta poin progress-nya (seperti `S3`, `S4`, `S5`, `S6`, `K1`, `K2`).

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\KategoriMurid.php`
- **Tabel**: `kategori_murid`
- **Fields**: `kode_kategori` (string, 10, unique - contoh: `S3`, `S4`), `nama_kategori` (string, 50), `poin_progress` (decimal, 8,2)
- **Relasi**:
  - `murid()` : HasMany `Murid`

### 2. Controller: `App\Http\Controllers\KategoriMuridController.php`
- **Metode**:
  - `index()` : Menampilkan daftar kategori
  - `store()` / `update()` / `destroy()` : CRUD standar kategori

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('kategori-murid', KategoriMuridController::class);`

### 4. React (Inertia) Page: `resources/js/pages/KategoriMurid/Index.tsx`
- **UI**: Tabel kode kategori, nama, dan poin progress, beserta Form Dialog tambah/edit.
