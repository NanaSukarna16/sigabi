<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $units = Unit::latest()->get();
        return Inertia::render('Units/Index', [
            'units' => $units
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_unit' => 'required|string|max:100',
            'alamat' => 'nullable|string|max:255',
        ]);

        Unit::create($validated);

        return redirect()->back()->with('success', 'Unit berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $validated = $request->validate([
            'nama_unit' => 'required|string|max:100',
            'alamat' => 'nullable|string|max:255',
        ]);

        $unit->update($validated);

        return redirect()->back()->with('success', 'Unit berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->back()->with('success', 'Unit berhasil dihapus.');
    }
}
