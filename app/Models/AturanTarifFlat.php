<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AturanTarifFlat extends Model
{
    use HasFactory;

    protected $table = 'aturan_tarif_flat';

    protected $fillable = [
        'jenis_murid',
        'nominal_insentif',
    ];
}
