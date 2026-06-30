<?php

namespace App\Http\Controllers;

use App\Models\KategoriMurid;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class KategoriMuridController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = KategoriMurid::latest()->get();
        return Inertia::render('KategoriMurid/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kategori' => 'required|string|max:10|unique:kategori_murid,kode_kategori',
            'nama_kategori' => 'nullable|string|max:50',
            'poin_progress' => 'required|numeric|min:0',
        ]);

        KategoriMurid::create($validated);

        return redirect()->back()->with('success', 'Kategori murid berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KategoriMurid $kategoriMurid): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kategori' => [
                'required',
                'string',
                'max:10',
                Rule::unique('kategori_murid')->ignore($kategoriMurid->id)
            ],
            'nama_kategori' => 'nullable|string|max:50',
            'poin_progress' => 'required|numeric|min:0',
        ]);

        $kategoriMurid->update($validated);

        return redirect()->back()->with('success', 'Kategori murid berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KategoriMurid $kategoriMurid): RedirectResponse
    {
        $kategoriMurid->delete();

        return redirect()->back()->with('success', 'Kategori murid berhasil dihapus.');
    }
}
