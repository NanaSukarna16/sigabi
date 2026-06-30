# Rencana Pengembangan: Modul Kategori Murid (Master)

Modul ini digunakan untuk mengelola kategori tingkatan murid beserta poin progress-nya.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\KategoriMurid.php`
- **Tabel**: `kategori_murid`
- **Fields**: `kode_kategori` (string, 10, unique), `nama_kategori` (string, 50), `poin_progress` (decimal, 8,2)
- **Relasi**:
  - `murid()` : HasMany `Murid`

### 2. Controller: `App\Http\Controllers\KategoriMuridController.php`
- **Metode**:
  - `index()` : Menampilkan daftar kategori (Inertia Render)
  - `store()` : Validasi & menyimpan data baru
  - `update()` : Validasi & memperbarui data
  - `destroy()` : Menghapus kategori

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('kategori-murid', KategoriMuridController::class);`

### 4. React (Inertia) Page: `resources/js/pages/KategoriMurid/Index.tsx`
- **UI Element (Shadcn UI)**:
  - `<Table>` daftar kode, nama kategori, dan nilai poin progress.
  - `<Dialog>` form input tambah/edit.
  - `<AlertDialog>` konfirmasi hapus.
