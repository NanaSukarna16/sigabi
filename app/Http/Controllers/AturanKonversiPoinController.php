<?php

namespace App\Http\Controllers;

use App\Models\AturanKonversiPoin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class AturanKonversiPoinController extends Controller
{
    public function index(): Response
    {
        $conversions = AturanKonversiPoin::orderBy('role')->orderBy('poin_minimal')->get();
        return Inertia::render('AturanKonversiPoin/Index', [
            'conversions' => $conversions
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['guru', 'kepala_unit'])],
            'poin_minimal' => 'required|numeric|min:0',
            'poin_maksimal' => 'required|numeric|gte:poin_minimal',
            'nominal_insentif' => 'required|numeric|min:0',
        ]);

        AturanKonversiPoin::create($validated);

        return redirect()->back()->with('success', 'Aturan konversi poin berhasil ditambahkan.');
    }

    public function update(Request $request, AturanKonversiPoin $aturanKonversiPoin): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['guru', 'kepala_unit'])],
            'poin_minimal' => 'required|numeric|min:0',
            'poin_maksimal' => 'required|numeric|gte:poin_minimal',
            'nominal_insentif' => 'required|numeric|min:0',
        ]);

        $aturanKonversiPoin->update($validated);

        return redirect()->back()->with('success', 'Aturan konversi poin berhasil diperbarui.');
    }

    public function destroy(AturanKonversiPoin $aturanKonversiPoin): RedirectResponse
    {
        $aturanKonversiPoin->delete();

        return redirect()->back()->with('success', 'Aturan konversi poin berhasil dihapus.');
    }
}
