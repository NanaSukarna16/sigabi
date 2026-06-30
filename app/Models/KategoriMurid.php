<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriMurid extends Model
{
    use HasFactory;

    protected $table = 'kategori_murid';

    protected $fillable = [
        'kode_kategori',
        'nama_kategori',
        'poin_progress',
    ];

    public function murid(): HasMany
    {
        return $this->hasMany(Murid::class, 'kategori_murid_id');
    }

    public function detailProgress(): HasMany
    {
        return $this->hasMany(DetailProgress::class, 'kategori_murid_id');
    }
}
