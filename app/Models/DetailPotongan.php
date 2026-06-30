<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPotongan extends Model
{
    use HasFactory;

    protected $table = 'detail_potongan';

    public $timestamps = false;

    protected $fillable = [
        'penggajian_id',
        'aturan_potongan_id',
        'jumlah_pelanggaran',
        'total_potongan',
        'created_at',
    ];

    public function penggajian(): BelongsTo
    {
        return $this->belongsTo(Penggajian::class, 'penggajian_id');
    }

    public function aturanPotongan(): BelongsTo
    {
        return $this->belongsTo(AturanPotongan::class, 'aturan_potongan_id');
    }
}
