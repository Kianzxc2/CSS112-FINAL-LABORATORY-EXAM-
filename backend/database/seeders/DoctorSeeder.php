<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DoctorSeeder extends Seeder
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
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;

            DB::table('doctors')->insert([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'specialization' => $faker->randomElement(['Cardiology', 'Neurology', 'Oncology', 'Pediatrics']),
                'license_number' => $faker->unique()->numerify('#####'),
                'phone' => $faker->phoneNumber,
                'email' => strtolower($firstName . '.' . $lastName . '@example.com'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
