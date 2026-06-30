# Rencana Pengembangan: Status & Kalkulasi Mandiri Penggajian

Modul ini memperluas fungsionalitas Modul Penggajian untuk mendukung status slip gaji (`draft` vs `final`) serta memberikan hak akses bagi masing-masing Guru / Kepala Unit untuk menghitung pratinjau gaji mereka secara mandiri sebelum disetujui (finalisasi) oleh Superadmin.

## 1. Perubahan Skema Database (`penggajian`)
*   **Kolom Baru**: `status` (`enum: ['draft', 'final']`, default `'draft'`).
*   **Tujuan**:
    *   `draft`: Dihitung secara mandiri oleh karyawan (Guru/Kepala Unit) atau belum disetujui secara resmi.
    *   `final`: Dihitung dan diposting oleh Superadmin (siap dibayar dan bersifat permanen/terkunci).

## 2. Alur Pengguna (User Flow)

### A. Untuk Guru & Kepala Unit (Kalkulasi Mandiri)
1.  Karyawan dapat masuk ke menu **Kalkulasi Mandiri** (Inertia Page: `/penggajian/calculate-self`).
2.  Karyawan memilih bulan & tahun berjalan untuk melihat estimasi pratinjau gaji bersih mereka (beserta rincian poin, kehadiran, dan potongan).
3.  Karyawan dapat menekan tombol **Simpan Draft**. Slip gaji tersimpan di database dengan `status = 'draft'`.

### B. Untuk Superadmin (Verifikasi & Posting Gaji)
1.  Superadmin membuka menu **Hitung Gaji** (`/penggajian/calculate`).
2.  Superadmin dapat melihat daftar rekap pengajuan gaji seluruh staf dalam status `draft`.
3.  Superadmin melakukan peninjauan rincian absensi & poin progress.
4.  Superadmin menekan tombol **Posting Gaji (Finalisasi)**. Status slip gaji berubah menjadi `final` (tidak dapat diedit lagi oleh karyawan).

## 3. Komponen yang Perlu Dibuat / Diubah

### A. Migrasi Database
*   Modifikasi tabel `penggajian` untuk menambahkan kolom status:
    ```php
    $table->enum('status', ['draft', 'final'])->default('draft');
    ```

### B. Controller (`PenggajianController.php`)
*   Tambahkan metode `calculateSelf()` untuk merender halaman kalkulasi mandiri karyawan.
*   Sesuaikan metode `store()` untuk menetapkan `status = 'final'` jika dilakukan oleh Superadmin, dan `status = 'draft'` jika dilakukan oleh karyawan biasa.

### C. Halaman React (Inertia Pages)
*   `resources/js/pages/Penggajian/CalculateSelf.tsx` [NEW]: Tampilan estimasi/kalkulasi mandiri bagi Guru & Kepala Unit.
