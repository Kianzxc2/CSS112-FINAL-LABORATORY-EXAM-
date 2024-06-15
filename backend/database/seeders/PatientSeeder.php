<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            DB::table('patients')->insert([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'date_of_birth' => $faker->date($format = 'Y-m-d', $max = 'now'),
                'gender' => $faker->randomElement(['male', 'female', 'other']),
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'emergency_contact' => $faker->phoneNumber,
                'medical_history' => $faker->text,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
