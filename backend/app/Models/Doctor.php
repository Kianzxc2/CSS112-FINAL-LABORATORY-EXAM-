<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $primaryKey = 'doctor_id'; 
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'specialization',
        'license_number',
        'phone',
        'email',
    ];
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

}
