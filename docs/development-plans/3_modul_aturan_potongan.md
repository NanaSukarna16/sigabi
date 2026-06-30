# Rencana Pengembangan: Modul Aturan Potongan (Master) [SELESAI]

Modul ini digunakan untuk mengelola jenis potongan (misal: Absen, Telat) beserta nominal potongannya. Seluruh komponen CRUD telah selesai diimplementasikan.

## Komponen yang Telah Dibuat:

### 1. Model: `App\Models\AturanPotongan.php` [SELESAI]
- **Tabel**: `aturan_potongan`
- **Fields**: `jenis_potongan` (string, 50), `nominal_potongan` (decimal, 12,2)
- **Relasi**:
  - `detailPotongan()` : HasMany `DetailPotongan`

### 2. Controller: `App\Http\Controllers\AturanPotonganController.php` [SELESAI]
- **Metode**:
  - `index()` : Menampilkan daftar aturan potongan
  - `store()` : Menyimpan aturan baru
  - `update()` : Mengubah nominal atau jenis potongan
  - `destroy()` : Menghapus aturan

### 3. Route: `routes/web.php` [SELESAI]
- **Definisi**: `Route::resource('aturan-potongan', AturanPotonganController::class);` di daftarkan dalam group middleware `auth`.

### 4. React (Inertia) Page: `resources/js/pages/AturanPotongan/Index.tsx` [SELESAI]
- **UI Element (Shadcn UI)**:
  - `<Table>` daftar potongan dan nominal.
  - `<Dialog>` untuk create/update.
