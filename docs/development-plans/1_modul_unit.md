# Rencana Pengembangan: Modul Unit (Master) [SELESAI]

Modul ini digunakan untuk mengelola data unit biMBA. Seluruh komponen CRUD telah selesai diimplementasikan.

## Komponen yang Telah Dibuat:

### 1. Model: `App\Models\Unit.php` [SELESAI]
- **Tabel**: `units`
- **Fields**: `nama_unit` (string, 100), `alamat` (string, 255)
- **Relasi**:
  - `users()` : HasMany `User`
  - `murid()` : HasMany `Murid`

### 2. Controller: `App\Http\Controllers\UnitController.php` [SELESAI]
- **Metode**:
  - `index()` : Menampilkan daftar unit (Inertia Render)
  - `store()` : Validasi & menyimpan unit baru
  - `update()` : Validasi & memperbarui unit
  - `destroy()` : Menghapus unit

### 3. Route: `routes/web.php` [SELESAI]
- **Definisi**: `Route::resource('units', UnitController::class);` di daftarkan dalam group middleware `auth`.

### 4. React (Inertia) Page: `resources/js/pages/Units/Index.tsx` [SELESAI]
- **UI Element (Shadcn UI)**:
  - `<Table>` custom bergaya modern dengan Tailwind CSS.
  - `<Button>` dan `<Dialog>` untuk form tambah/edit unit (menggunakan Inertia `useForm`).
  - Fitur pencarian instan sisi klien (client-side search).
  - Konfirmasi hapus unit dengan standard window confirm dialog.
