<?php

namespace App\Http\Controllers;

use App\Models\AturanPotongan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AturanPotonganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $rules = AturanPotongan::latest()->get();
        return Inertia::render('AturanPotongan/Index', [
            'rules' => $rules
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_potongan' => 'required|string|max:50',
            'nominal_potongan' => 'required|numeric|min:0',
        ]);

        AturanPotongan::create($validated);

        return redirect()->back()->with('success', 'Aturan potongan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AturanPotongan $aturanPotongan): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_potongan' => 'required|string|max:50',
            'nominal_potongan' => 'required|numeric|min:0',
        ]);

        $aturanPotongan->update($validated);

        return redirect()->back()->with('success', 'Aturan potongan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AturanPotongan $aturanPotongan): RedirectResponse
    {
        $aturanPotongan->delete();

        return redirect()->back()->with('success', 'Aturan potongan berhasil dihapus.');
    }
}
