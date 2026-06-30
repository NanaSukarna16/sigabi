<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AturanKonversiPoin extends Model
{
    use HasFactory;

    protected $table = 'aturan_konversi_poin';

    protected $fillable = [
        'role',
        'poin_minimal',
        'poin_maksimal',
        'nominal_insentif',
    ];
}
