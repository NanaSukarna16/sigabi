<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailProgress extends Model
{
    use HasFactory;

    protected $table = 'detail_progress';

    // Disabling default timestamps since we use custom timestamp created_at
    public $timestamps = false;

    protected $fillable = [
        'penggajian_id',
        'murid_id',
        'kategori_murid_id',
        'poin_didapat',
        'nominal_insentif',
        'created_at',
    ];

    public function penggajian(): BelongsTo
    {
        return $this->belongsTo(Penggajian::class, 'penggajian_id');
    }

    public function murid(): BelongsTo
    {
        return $this->belongsTo(Murid::class, 'murid_id');
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriMurid::class, 'kategori_murid_id');
    }
}
