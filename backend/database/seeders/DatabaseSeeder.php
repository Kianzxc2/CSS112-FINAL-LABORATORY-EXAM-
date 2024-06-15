<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create an admin user
        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'), // Change 'admin' to a secure password
            'role' => 'admin',
        ]);

        // // Create two doctors
        // for ($i = 1; $i <= 2; $i++) {
        //     User::create([
        //         'name' => 'doctor' . $i,
        //         'email' => $faker->unique()->safeEmail,
        //         'password' => Hash::make('doctor'), // Change 'doctor' . $i to a secure password
        //         'role' => 'doctor',
        //     ]);
        // }

        // for ($i = 1; $i <= 7; $i++) {
        //     User::create([
        //         'name' => $faker->firstName . ' ' . $faker->lastName,
        //         'email' => $faker->unique()->safeEmail,
        //         'password' => Hash::make('password'), // Change 'password' to a secure password
        //         'role' => 'patient',
        //     ]);
        // }
        // $this->call([
        //     DoctorSeeder::class,
        //     PatientSeeder::class
        // ]);
    }
}
