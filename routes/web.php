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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('units', UnitController::class);
    Route::resource('users', UserController::class);
    Route::resource('kategori-murid', KategoriMuridController::class);
    Route::resource('aturan-potongan', AturanPotonganController::class);
    Route::resource('murid', MuridController::class);
});

require __DIR__.'/settings.php';
