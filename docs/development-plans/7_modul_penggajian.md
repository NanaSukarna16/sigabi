# Rencana Pengembangan: Modul Penggajian (Core)

Modul core untuk memproses perhitungan gaji kotor, potongan ketidakhadiran, insentif poin progress (dari murid reguler `S3-S6`, `K1-K2` terkonversi berdasarkan rentang/range), tarif flat murid khusus (`dhuafa`, `trial`, `baru`), hingga mencetak slip gaji bulanan.

## Komponen yang Perlu Dibuat / Diubah:

### 1. Models:
- **`App\Models\Penggajian.php`**: Menyimpan total gaji, potongan, dan tunjangan per bulan.
- **`App\Models\DetailProgress.php`**: Mencatat nominal rupiah yang didapatkan dari murid reguler (poin konversi) dan murid tarif khusus.
- **`App\Models\DetailPotongan.php`**: Mencatat rincian potongan.
- **`App\Models\AturanKonversiPoin.php`**: Menyimpan konfigurasi konversi rentang poin bulanan ke nominal rupiah.
- **`App\Models\AturanTarifFlat.php`**: Menyimpan konfigurasi nominal tarif flat jenis murid khusus.

### 2. Controller: `App\Http\Controllers\PenggajianController.php`
- **Metode**:
  - `index()` : Riwayat penggajian bulanan
  - `calculate(Request $request)` : Menghitung gaji otomatis:
    1. Hitung total poin murid reguler guru, lalu cari nominal rupiahnya berdasarkan rentang poin di tabel `aturan_konversi_poin` untuk role guru/kepala unit tersebut.
    2. Hitung jumlah murid dhuafa, trial, baru, lalu kalikan masing-masing dengan tarif flat dari tabel `aturan_tarif_flat`.
    3. Total insentif progress = nominal konversi rentang poin + nominal tarif flat murid khusus.
    4. Gaji Bersih = Gaji Pokok + Tunjangan + Total Insentif Progress - Potongan.

### 3. Route: `routes/web.php`
- Resource route penggajian dan endpoint `/penggajian/calculate`.
- Menambahkan route admin untuk mengatur `aturan-konversi-poin` dan `aturan-tarif-flat`.

### 4. React (Inertia) Pages:
- `resources/js/pages/Penggajian/Index.tsx` (Daftar riwayat gaji bulanan)
- `resources/js/pages/Penggajian/Calculate.tsx` (Wizard form proses hitung gaji)
- `resources/js/pages/AturanKonversiPoin/Index.tsx` [NEW] (Halaman admin untuk mengatur rentang poin ke nominal rupiah)
- `resources/js/pages/AturanTarifFlat/Index.tsx` [NEW] (Halaman admin untuk mengatur nominal flat dhuafa/trial/baru)
