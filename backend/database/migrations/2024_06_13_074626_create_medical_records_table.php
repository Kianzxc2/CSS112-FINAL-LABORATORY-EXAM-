<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicalRecordsTable extends Migration
{
    public function up()
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // unsigned big integer for foreign key
            $table->unsignedBigInteger('doctor_id'); // unsigned big integer for foreign key
            $table->date('visit_date');
            $table->text('diagnosis');
            $table->text('treatment');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Defining the foreign key constraints
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('medical_records');
    }
}
