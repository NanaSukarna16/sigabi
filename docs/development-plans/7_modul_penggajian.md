# Rencana Pengembangan: Modul Penggajian (Core) [SELESAI]

Modul core untuk memproses perhitungan gaji kotor, potongan ketidakhadiran, insentif poin progress (dari murid reguler `S3-S6`, `K1-K2` terkonversi berdasarkan rentang/range), tarif flat murid khusus (`dhuafa`, `trial`, `baru`), hingga mencetak slip gaji bulanan. Seluruh komponen fungsional telah selesai diimplementasikan.

## Komponen yang Telah Dibuat:

### 1. Models: [SELESAI]
- **`App\Models\Penggajian.php`**: Menyimpan total gaji, potongan, dan tunjangan per bulan.
- **`App\Models\DetailProgress.php`**: Mencatat nominal rupiah yang didapatkan dari murid reguler (poin konversi) dan murid tarif khusus.
- **`App\Models\DetailPotongan.php`**: Mencatat rincian potongan.
- **`App\Models\AturanKonversiPoin.php`**: Menyimpan konfigurasi konversi rentang poin bulanan ke nominal rupiah.
- **`App\Models\AturanTarifFlat.php`**: Menyimpan konfigurasi nominal tarif flat jenis murid khusus.

### 2. Controllers: [SELESAI]
- **`App\Http\Controllers\AturanKonversiPoinController.php`**: CRUD range poin ke nominal insentif berdasarkan role.
- **`App\Http\Controllers\AturanTarifFlatController.php`**: CRUD tarif flat murid khusus (`dhuafa`, `trial`, `baru`).
- **`App\Http\Controllers\PenggajianController.php`**:
  - `index()` : Riwayat penggajian bulanan
  - `create()` : Menampilkan preview kalkulasi gaji
  - `store()` : Menyimpan hasil rekap gaji bulanan & rinciannya (detail_progress & detail_potongan) secara transaksional database.

### 3. Routes: `routes/web.php` [SELESAI]
- Resource route penggajian, aturan-konversi-poin, aturan-tarif-flat, dan endpoint `/penggajian/calculate`.

### 4. React (Inertia) Pages: [SELESAI]
- `resources/js/pages/Penggajian/Index.tsx` (Daftar riwayat gaji bulanan & cetak slip gaji)
- `resources/js/pages/Penggajian/Calculate.tsx` (Kalkulator gaji otomatis dengan inspeksi rincian mendalam)
- `resources/js/pages/AturanKonversiPoin/Index.tsx` (Pengaturan rentang poin ke nominal rupiah)
- `resources/js/pages/AturanTarifFlat/Index.tsx` (Pengaturan nominal flat dhuafa/trial/baru)
