<?php

namespace App\Http\Controllers;

use App\Models\Murid;
use App\Models\Unit;
use App\Models\User;
use App\Models\KategoriMurid;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class MuridController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $murids = Murid::with(['user', 'unit', 'kategori'])->latest()->get();
        $units = Unit::all();
        $gurus = User::where('role', 'guru')->get();
        $categories = KategoriMurid::all();

        return Inertia::render('Murid/Index', [
            'murids' => $murids,
            'units' => $units,
            'gurus' => $gurus,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_murid' => 'required|string|max:100',
            'user_id' => 'nullable|exists:users,id',
            'unit_id' => 'nullable|exists:units,id',
            'jenis_murid' => ['required', Rule::in(['reguler', 'dhuafa', 'trial', 'baru'])],
            'kategori_murid_id' => [
                Rule::requiredIf($request->jenis_murid === 'reguler'),
                'nullable',
                'exists:kategori_murid,id'
            ],
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
        ]);

        // If not reguler, clear kategori_murid_id just in case
        if ($validated['jenis_murid'] !== 'reguler') {
            $validated['kategori_murid_id'] = null;
        }

        Murid::create($validated);

        return redirect()->back()->with('success', 'Murid berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Murid $murid): RedirectResponse
    {
        $validated = $request->validate([
            'nama_murid' => 'required|string|max:100',
            'user_id' => 'nullable|exists:users,id',
            'unit_id' => 'nullable|exists:units,id',
            'jenis_murid' => ['required', Rule::in(['reguler', 'dhuafa', 'trial', 'baru'])],
            'kategori_murid_id' => [
                Rule::requiredIf($request->jenis_murid === 'reguler'),
                'nullable',
                'exists:kategori_murid,id'
            ],
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
        ]);

        if ($validated['jenis_murid'] !== 'reguler') {
            $validated['kategori_murid_id'] = null;
        }

        $murid->update($validated);

        return redirect()->back()->with('success', 'Murid berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Murid $murid): RedirectResponse
    {
        $murid->delete();

        return redirect()->back()->with('success', 'Murid berhasil dihapus.');
    }
}
