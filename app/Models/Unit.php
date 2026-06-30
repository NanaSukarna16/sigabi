<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    protected $table = 'units';

    protected $fillable = [
        'nama_unit',
        'alamat',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'unit_id');
    }

    public function murid(): HasMany
    {
        return $this->hasMany(Murid::class, 'unit_id');
    }
}
