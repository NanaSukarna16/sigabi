<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriMuridController;
use App\Http\Controllers\AturanPotonganController;
use App\Http\Controllers\MuridController;
use App\Http\Controllers\KehadiranController;
use App\Http\Controllers\AturanKonversiPoinController;
use App\Http\Controllers\AturanTarifFlatController;
use App\Http\Controllers\PenggajianController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('units', UnitController::class);
    Route::resource('users', UserController::class);
    Route::resource('kategori-murid', KategoriMuridController::class);
    Route::resource('aturan-potongan', AturanPotonganController::class);
    Route::resource('murid', MuridController::class);
    Route::resource('kehadiran', KehadiranController::class)->only(['index', 'store']);
    
    Route::get('penggajian/calculate', [PenggajianController::class, 'create'])->name('penggajian.calculate');
    Route::resource('penggajian', PenggajianController::class)->only(['index', 'store', 'destroy']);
    Route::resource('aturan-konversi-poin', AturanKonversiPoinController::class);
    Route::resource('aturan-tarif-flat', AturanTarifFlatController::class);
});

require __DIR__.'/settings.php';
