<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AturanPotongan extends Model
{
    use HasFactory;

    protected $table = 'aturan_potongan';

    protected $fillable = [
        'jenis_potongan',
        'nominal_potongan',
    ];

    public function detailPotongan(): HasMany
    {
        return $this->hasMany(DetailPotongan::class, 'aturan_potongan_id');
    }
}
