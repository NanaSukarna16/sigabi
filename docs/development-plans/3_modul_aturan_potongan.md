# Rencana Pengembangan: Modul Aturan Potongan (Master)

Modul ini digunakan untuk mengelola jenis potongan (misal: Absen, Telat) beserta nominal potongannya.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Model: `App\Models\AturanPotongan.php`
- **Tabel**: `aturan_potongan`
- **Fields**: `jenis_potongan` (string, 50), `nominal_potongan` (decimal, 12,2)
- **Relasi**:
  - `detailPotongan()` : HasMany `DetailPotongan`

### 2. Controller: `App\Http\Controllers\AturanPotonganController.php`
- **Metode**:
  - `index()` : Menampilkan daftar aturan potongan
  - `store()` : Menyimpan aturan baru
  - `update()` : Mengubah nominal atau jenis potongan
  - `destroy()` : Menghapus aturan

### 3. Route: `routes/web.php`
- **Definisi**: `Route::resource('aturan-potongan', AturanPotonganController::class);`

### 4. React (Inertia) Page: `resources/js/pages/AturanPotongan/Index.tsx`
- **UI Element (Shadcn UI)**:
  - `<Table>` daftar potongan dan nominal.
  - `<Dialog>` untuk create/update.
