<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;

Route::post('register', [LoginController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('doctors', [DoctorController::class, 'index']);
Route::post('doctors', [DoctorController::class, 'store']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::put('doctors/{id}', [DoctorController::class, 'update']);
Route::delete('doctors/{id}', [DoctorController::class, 'destroy']);

Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::get('/getPatients/{id}', [PatientController::class, 'getPatient']);
Route::get('/patients/{id}/appointments', [PatientController::class, 'getAppointments']);
Route::get('/patients/{id}/medical-history', [PatientController::class, 'getMedicalHistory']);
Route::post('patients', [PatientController::class, 'store']);
Route::put('patients/{id}', [PatientController::class, 'update']);
Route::delete('patients/{id}', [PatientController::class, 'destroy']);

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('appointments', [AppointmentController::class, 'bookAppointment']);
Route::put('appointments/{id}', [AppointmentController::class, 'update']);
Route::put('appointments/resched/{id}', [AppointmentController::class, 'rescheduleAppointment']);
Route::patch('/appointments/{id}', [AppointmentController::class, 'updateStatus']);
//http://127.0.0.1:8000/api/appointments/${appointmentId}
Route::put('appointments/{id}/confirm', [AppointmentController::class, 'confirmAppointment']);
Route::put('appointments/{id}/cancel', [AppointmentController::class, 'cancelAppointment']);
Route::put('appointments/{id}/complete', [AppointmentController::class, 'completeAppointment']);
Route::delete('appointments/{id}', [AppointmentController::class, 'delete']);
Route::get('doctor-appointments/{doctor_id}', [AppointmentController::class, 'doctorAppointments']);


Route::post('users', [UserController::class, 'addUser']);
Route::delete('/users/{id}', [UserController::class, 'delete']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);

Route::post('medical_records', [MedicalRecordController::class, 'store']);
Route::get('medical_records/{patient_id}', [MedicalRecordController::class, 'index']);
Route::get('doctor-medical_records/{patient_id}', [MedicalRecordController::class, 'doctorView']);

Route::middleware('auth:sanctum', 'verified')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->get('/patient/medical_records', [MedicalRecordController::class, 'index']);

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
});
