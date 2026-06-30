<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Murid extends Model
{
    use HasFactory;

    protected $table = 'murid';

    protected $fillable = [
        'user_id',
        'unit_id',
        'kategori_murid_id',
        'nama_murid',
        'status',
        'jenis_murid',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriMurid::class, 'kategori_murid_id');
    }

    public function detailProgress(): HasMany
    {
        return $this->hasMany(DetailProgress::class, 'murid_id');
    }
}
