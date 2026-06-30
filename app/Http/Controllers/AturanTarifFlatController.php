<?php

namespace App\Http\Controllers;

use App\Models\AturanTarifFlat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class AturanTarifFlatController extends Controller
{
    public function index(): Response
    {
        $tariffs = AturanTarifFlat::latest()->get();
        return Inertia::render('AturanTarifFlat/Index', [
            'tariffs' => $tariffs
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_murid' => 'required|string|max:50|unique:aturan_tarif_flat,jenis_murid',
            'nominal_insentif' => 'required|numeric|min:0',
        ]);

        AturanTarifFlat::create($validated);

        return redirect()->back()->with('success', 'Aturan tarif flat berhasil ditambahkan.');
    }

    public function update(Request $request, AturanTarifFlat $aturanTarifFlat): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_murid' => [
                'required',
                'string',
                'max:50',
                Rule::unique('aturan_tarif_flat')->ignore($aturanTarifFlat->id)
            ],
            'nominal_insentif' => 'required|numeric|min:0',
        ]);

        $aturanTarifFlat->update($validated);

        return redirect()->back()->with('success', 'Aturan tarif flat berhasil diperbarui.');
    }

    public function destroy(AturanTarifFlat $aturanTarifFlat): RedirectResponse
    {
        $aturanTarifFlat->delete();

        return redirect()->back()->with('success', 'Aturan tarif flat berhasil dihapus.');
    }
}
