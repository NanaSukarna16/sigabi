<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class KehadiranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $bulan = (int) $request->query('bulan', Carbon::now()->month);
        $tahun = (int) $request->query('tahun', Carbon::now()->year);

        // Get all teachers
        $gurus = User::whereIn('role', ['guru', 'kepala_unit'])
            ->where('status', 'aktif')
            ->get();

        // Get attendance records for selected month & year
        $attendanceRecords = Kehadiran::where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->get()
            ->keyBy('user_id');

        // Merge gurus with their attendance records
        $teachersData = $gurus->map(function ($guru) use ($attendanceRecords) {
            $record = $attendanceRecords->get($guru->id);
            return [
                'user_id' => $guru->id,
                'name' => $guru->name,
                'role' => $guru->role,
                'jumlah_hadir' => $record ? $record->jumlah_hadir : 0,
                'jumlah_tidak_hadir' => $record ? $record->jumlah_tidak_hadir : 0,
                'jumlah_telat' => $record ? $record->jumlah_telat : 0,
                'persentase_kehadiran' => $record ? $record->persentase_kehadiran : 100.00,
            ];
        });

        return Inertia::render('Kehadiran/Index', [
            'teachersData' => $teachersData,
            'currentBulan' => $bulan,
            'currentTahun' => $tahun,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020|max:2100',
            'attendance' => 'required|array',
            'attendance.*.user_id' => 'required|exists:users,id',
            'attendance.*.jumlah_hadir' => 'required|integer|min:0',
            'attendance.*.jumlah_tidak_hadir' => 'required|integer|min:0',
            'attendance.*.jumlah_telat' => 'required|integer|min:0',
        ]);

        $bulan = $validated['bulan'];
        $tahun = $validated['tahun'];

        foreach ($validated['attendance'] as $item) {
            $hadir = (int) $item['jumlah_hadir'];
            $tidakHadir = (int) $item['jumlah_tidak_hadir'];
            
            // Calculate percentage
            $totalDays = $hadir + $tidakHadir;
            $percentage = $totalDays > 0 ? round(($hadir / $totalDays) * 100, 2) : 0;

            Kehadiran::updateOrCreate(
                [
                    'user_id' => $item['user_id'],
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                ],
                [
                    'jumlah_hadir' => $hadir,
                    'jumlah_tidak_hadir' => $tidakHadir,
                    'jumlah_telat' => (int) $item['jumlah_telat'],
                    'persentase_kehadiran' => $percentage,
                ]
            );
        }

        return redirect()->back()->with('success', 'Kehadiran berhasil disimpan.');
    }
}
