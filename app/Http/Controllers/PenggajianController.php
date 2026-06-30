<?php

namespace App\Http\Controllers;

use App\Models\Penggajian;
use App\Models\User;
use App\Models\Murid;
use App\Models\Kehadiran;
use App\Models\AturanPotongan;
use App\Models\AturanKonversiPoin;
use App\Models\AturanTarifFlat;
use App\Models\DetailProgress;
use App\Models\DetailPotongan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PenggajianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $salaries = Penggajian::with(['user'])->latest()->get();
        return Inertia::render('Penggajian/Index', [
            'salaries' => $salaries
        ]);
    }

    /**
     * Show the page to calculate payrolls.
     */
    public function create(Request $request): Response
    {
        $bulan = (int) $request->query('bulan', Carbon::now()->month);
        $tahun = (int) $request->query('tahun', Carbon::now()->year);

        $employees = User::where('status', 'aktif')
            ->whereIn('role', ['guru', 'kepala_unit'])
            ->get();

        $potonganRules = AturanPotongan::all();
        $flatTariffs = AturanTarifFlat::all()->keyBy('jenis_murid');

        $previewData = $employees->map(function ($emp) use ($bulan, $tahun, $potonganRules, $flatTariffs) {
            // 1. Kehadiran & Potongan
            $kehadiran = Kehadiran::where('user_id', $emp->id)
                ->where('bulan', $bulan)
                ->where('tahun', $tahun)
                ->first();

            $totalPotongan = 0;
            $potonganDetails = [];

            if ($kehadiran) {
                foreach ($potonganRules as $rule) {
                    $qty = 0;
                    if (str_contains(strtolower($rule->jenis_potongan), 'absen') || str_contains(strtolower($rule->jenis_potongan), 'tidak hadir')) {
                        $qty = $kehadiran->jumlah_tidak_hadir;
                    } elseif (str_contains(strtolower($rule->jenis_potongan), 'telat') || str_contains(strtolower($rule->jenis_potongan), 'lambat')) {
                        $qty = $kehadiran->jumlah_telat;
                    }

                    if ($qty > 0) {
                        $subtotal = $qty * $rule->nominal_potongan;
                        $totalPotongan += $subtotal;
                        $potonganDetails[] = [
                            'jenis' => $rule->jenis_potongan,
                            'qty' => $qty,
                            'nominal' => $rule->nominal_potongan,
                            'subtotal' => $subtotal,
                        ];
                    }
                }
            }

            // 2. Insentif Murid
            $totalPoints = 0;
            $insentifFlat = 0;
            $insentifPoin = 0;
            $insentifBaru = 0; // Khusus Kepala Unit
            $progressDetails = [];

            // Get students
            if ($emp->role === 'guru') {
                $murids = Murid::with('kategori')
                    ->where('user_id', $emp->id)
                    ->where('status', 'aktif')
                    ->get();
            } else {
                // Kepala Unit gets points/flat rates based on all students in their unit
                $murids = Murid::with('kategori')
                    ->where('unit_id', $emp->unit_id)
                    ->where('status', 'aktif')
                    ->get();
            }

            // Group students and calculate points
            foreach ($murids as $m) {
                if ($m->jenis_murid === 'reguler') {
                    $pts = $m->kategori ? (float) $m->kategori->poin_progress : 0;
                    $totalPoints += $pts;
                } elseif (in_array($m->jenis_murid, ['dhuafa', 'trial'])) {
                    $tariff = $flatTariffs->get($m->jenis_murid);
                    $sub = $tariff ? (float) $tariff->nominal_insentif : 0;
                    $insentifFlat += $sub;
                    $progressDetails[] = [
                        'nama_murid' => $m->nama_murid,
                        'jenis' => $m->jenis_murid,
                        'nominal' => $sub,
                    ];
                } elseif ($m->jenis_murid === 'baru' && $emp->role === 'kepala_unit') {
                    // Check if student was created in this salary month/year
                    $createdAt = Carbon::parse($m->created_at);
                    if ($createdAt->month === $bulan && $createdAt->year === $tahun) {
                        $tariff = $flatTariffs->get('baru');
                        $sub = $tariff ? (float) $tariff->nominal_insentif : 0;
                        $insentifBaru += $sub;
                        $progressDetails[] = [
                            'nama_murid' => $m->nama_murid,
                            'jenis' => 'pendaftaran murid baru',
                            'nominal' => $sub,
                        ];
                    }
                }
            }

            // Look up points bracket in aturan_konversi_poin
            $poinRule = AturanKonversiPoin::where('role', $emp->role)
                ->where('poin_minimal', '<=', $totalPoints)
                ->where('poin_maksimal', '>=', $totalPoints)
                ->first();

            if ($poinRule) {
                $insentifPoin = (float) $poinRule->nominal_insentif;
            }

            $totalInsentif = $insentifPoin + $insentifFlat + $insentifBaru;
            $gajiPokok = (float) $emp->gaji_pokok;
            $tunjanganKesehatan = (float) $emp->tunjangan_kesehatan;
            $tunjanganTransport = (float) $emp->tunjangan_transport;
            $tunjanganKerajinan = (float) $emp->tunjangan_kerajinan;
            $tunjangan = $tunjanganKesehatan + $tunjanganTransport + $tunjanganKerajinan;
            $gajiBersih = $gajiPokok + $tunjangan + $totalInsentif - $totalPotongan;

            return [
                'user_id' => $emp->id,
                'name' => $emp->name,
                'role' => $emp->role,
                'gaji_pokok' => $gajiPokok,
                'tunjangan_kesehatan' => $tunjanganKesehatan,
                'tunjangan_transport' => $tunjanganTransport,
                'tunjangan_kerajinan' => $tunjanganKerajinan,
                'tunjangan_jabatan' => $tunjangan,
                'total_points' => $totalPoints,
                'insentif_poin' => $insentifPoin,
                'insentif_flat' => $insentifFlat,
                'insentif_baru' => $insentifBaru,
                'total_insentif' => $totalInsentif,
                'total_potongan' => $totalPotongan,
                'gaji_bersih' => max(0, $gajiBersih),
                'potongan_details' => $potonganDetails,
                'progress_details' => $progressDetails,
                'kehadiran_summary' => $kehadiran ? [
                    'hadir' => $kehadiran->jumlah_hadir,
                    'tidak_hadir' => $kehadiran->jumlah_tidak_hadir,
                    'telat' => $kehadiran->jumlah_telat,
                ] : null,
            ];
        });

        return Inertia::render('Penggajian/Calculate', [
            'previewData' => $previewData,
            'currentBulan' => $bulan,
            'currentTahun' => $tahun,
        ]);
    }

    /**
     * Store calculated salaries into database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020|max:2100',
            'salaries' => 'required|array',
            'salaries.*.user_id' => 'required|exists:users,id',
            'salaries.*.gaji_pokok' => 'required|numeric',
            'salaries.*.tunjangan_kesehatan' => 'required|numeric',
            'salaries.*.tunjangan_transport' => 'required|numeric',
            'salaries.*.tunjangan_kerajinan' => 'required|numeric',
            'salaries.*.total_insentif' => 'required|numeric',
            'salaries.*.total_potongan' => 'required|numeric',
            'salaries.*.gaji_bersih' => 'required|numeric',
        ]);

        $bulan = $validated['bulan'];
        $tahun = $validated['tahun'];

        DB::transaction(function () use ($validated, $bulan, $tahun) {
            // Delete existing records for this month and year if recalculating
            $existing = Penggajian::where('bulan', $bulan)->where('tahun', $tahun)->get();
            foreach ($existing as $pay) {
                $pay->delete(); // Cascades delete detail_progress and detail_potongan
            }

            $potonganRules = AturanPotongan::all();
            $flatTariffs = AturanTarifFlat::all()->keyBy('jenis_murid');

            foreach ($validated['salaries'] as $salaryItem) {
                $emp = User::find($salaryItem['user_id']);

                $pay = Penggajian::create([
                    'user_id' => $emp->id,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                    'gaji_pokok' => $salaryItem['gaji_pokok'],
                    'tunjangan_kesehatan' => $salaryItem['tunjangan_kesehatan'],
                    'tunjangan_transport' => $salaryItem['tunjangan_transport'],
                    'tunjangan_kerajinan' => $salaryItem['tunjangan_kerajinan'],
                    'gaji_progress' => $salaryItem['total_insentif'],
                    'total_potongan' => $salaryItem['total_potongan'],
                    'total_gaji' => $salaryItem['gaji_bersih'],
                    'status' => 'dibayar',
                ]);

                // Write detail_potongan
                $kehadiran = Kehadiran::where('user_id', $emp->id)
                    ->where('bulan', $bulan)
                    ->where('tahun', $tahun)
                    ->first();

                if ($kehadiran) {
                    foreach ($potonganRules as $rule) {
                        $qty = 0;
                        if (str_contains(strtolower($rule->jenis_potongan), 'absen') || str_contains(strtolower($rule->jenis_potongan), 'tidak hadir')) {
                            $qty = $kehadiran->jumlah_tidak_hadir;
                        } elseif (str_contains(strtolower($rule->jenis_potongan), 'telat') || str_contains(strtolower($rule->jenis_potongan), 'lambat')) {
                            $qty = $kehadiran->jumlah_telat;
                        }

                        if ($qty > 0) {
                            DetailPotongan::create([
                                'penggajian_id' => $pay->id,
                                'aturan_potongan_id' => $rule->id,
                                'jumlah_pelanggaran' => $qty,
                                'total_potongan' => $qty * $rule->nominal_potongan,
                            ]);
                        }
                    }
                }

                // Write detail_progress
                if ($emp->role === 'guru') {
                    $murids = Murid::with('kategori')
                        ->where('user_id', $emp->id)
                        ->where('status', 'aktif')
                        ->get();
                } else {
                    $murids = Murid::with('kategori')
                        ->where('unit_id', $emp->unit_id)
                        ->where('status', 'aktif')
                        ->get();
                }

                foreach ($murids as $m) {
                    if ($m->jenis_murid === 'reguler') {
                        DetailProgress::create([
                            'penggajian_id' => $pay->id,
                            'murid_id' => $m->id,
                            'kategori_murid_id' => $m->kategori_murid_id,
                            'poin_didapat' => $m->kategori ? (float) $m->kategori->poin_progress : 0,
                            'nominal_insentif' => 0, // Calculated globally via range point table
                        ]);
                    } elseif (in_array($m->jenis_murid, ['dhuafa', 'trial'])) {
                        $tariff = $flatTariffs->get($m->jenis_murid);
                        $sub = $tariff ? (float) $tariff->nominal_insentif : 0;
                        DetailProgress::create([
                            'penggajian_id' => $pay->id,
                            'murid_id' => $m->id,
                            'kategori_murid_id' => null,
                            'poin_didapat' => 0,
                            'nominal_insentif' => $sub,
                        ]);
                    } elseif ($m->jenis_murid === 'baru' && $emp->role === 'kepala_unit') {
                        $createdAt = Carbon::parse($m->created_at);
                        if ($createdAt->month === $bulan && $createdAt->year === $tahun) {
                            $tariff = $flatTariffs->get('baru');
                            $sub = $tariff ? (float) $tariff->nominal_insentif : 0;
                            DetailProgress::create([
                                'penggajian_id' => $pay->id,
                                'murid_id' => $m->id,
                                'kategori_murid_id' => null,
                                'poin_didapat' => 0,
                                'nominal_insentif' => $sub,
                            ]);
                        }
                    }
                }
            }
        });

        return redirect()->route('penggajian.index')->with('success', 'Gaji bulanan berhasil dihitung dan disimpan.');
    }

    /**
     * Remove the specified salary record.
     */
    public function destroy(Penggajian $penggajian): RedirectResponse
    {
        $penggajian->delete();
        return redirect()->back()->with('success', 'Data slip gaji berhasil dihapus.');
    }
}
