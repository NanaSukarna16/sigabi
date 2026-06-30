<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $role = $request->query('role', 'guru');
        
        // Ensure only valid roles are processed here
        if (!in_array($role, ['guru', 'kepala_unit', 'superadmin'])) {
            $role = 'guru';
        }

        $users = User::with('unit')
            ->where('role', $role)
            ->latest()
            ->get();

        $units = Unit::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'units' => $units,
            'currentRole' => $role
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|string|min:8',
            'unit_id' => 'nullable|exists:units,id',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:255',
            'role' => ['required', Rule::in(['superadmin', 'guru', 'kepala_unit'])],
            'gaji_pokok' => 'nullable|numeric|min:0',
            'tunjangan_kesehatan' => 'nullable|numeric|min:0',
            'tunjangan_transport' => 'nullable|numeric|min:0',
            'tunjangan_kerajinan' => 'nullable|numeric|min:0',
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'Karyawan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => ['required', 'email', 'max:100', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'unit_id' => 'nullable|exists:units,id',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:255',
            'role' => ['required', Rule::in(['superadmin', 'guru', 'kepala_unit'])],
            'gaji_pokok' => 'nullable|numeric|min:0',
            'tunjangan_kesehatan' => 'nullable|numeric|min:0',
            'tunjangan_transport' => 'nullable|numeric|min:0',
            'tunjangan_kerajinan' => 'nullable|numeric|min:0',
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Karyawan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->back()->with('success', 'Karyawan berhasil dihapus.');
    }
}
