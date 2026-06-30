<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penggajian extends Model
{
    use HasFactory;

    protected $table = 'penggajian';

    protected $fillable = [
        'user_id',
        'bulan',
        'tahun',
        'gaji_pokok',
        'tunjangan_kesehatan',
        'tunjangan_transport',
        'tunjangan_kerajinan',
        'gaji_progress',
        'total_potongan',
        'total_gaji',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detailProgress(): HasMany
    {
        return $this->hasMany(DetailProgress::class, 'penggajian_id');
    }

    public function detailPotongan(): HasMany
    {
        return $this->hasMany(DetailPotongan::class, 'penggajian_id');
    }
}
