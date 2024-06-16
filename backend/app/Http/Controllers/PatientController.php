<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    public function index()
    {
        $patient = Patient::all();
        return response()->json(['users' => $patient]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:10',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|string|email|max:255',
            'emergency_contact' => 'nullable|string|max:255',
            'medical_history' => 'nullable|string',
        ]);
        
        $user = new User();
        $user->name = $request->first_name." ".$request->last_name;
        $user->email = $request->email;
        $user->role = 'patient';
        $user->password = Hash::make('password');
        $user->save();
        $patient = new Patient([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'date_of_birth' => $request->get('date_of_birth'),
            'gender' => $request->get('gender'),
            'address' => $request->get('address'),
            'phone' => $request->get('phone'),
            'email' => $request->get('email'),
            'emergency_contact' => $request->get('emergency_contact'),
            'medical_history' => $request->get('medical_history'),
        ]);
        $patient->user_id = $user->id; 
        $patient->created_at = now();
        $patient->updated_at = now();
        $patient->save();

        return response()->json([
            'message' => 'Patient created successfully',
            'patient' => $patient
        ], 201);
    }

    // Show a specific patient by ID
    public function show($id)
    {
        $patient = Patient::where('user_id', $id)->first();

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found'
            ], 404);
        }

        return response()->json([
            'patient' => $patient
        ], 200);
    }

    public function getPatient($id)
    {
        $patient = Patient::where('id', $id)->first();

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found'
            ], 404);
        }

        return response()->json([
            'patient' => $patient
        ], 200);
    }

    public function getAppointments($id)
{
    $appointments = Appointment::where('patient_id', $id)
        ->join('doctors', 'appointments.doctor_id', '=', 'doctors.doctor_id')
        ->where('status', '!=', 'cancelled')
        ->select('appointments.*', 'doctors.first_name as doctor_name', 'doctors.specialization')
        ->get();

    if ($appointments->isEmpty()) {
        return response()->json(['message' => 'No appointments found.']);
    }

    return response()->json(['appointments' => $appointments], 200);
}


    // Update a specific patient by ID
    public function update(Request $request, $id)
    {
        
        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'date_of_birth' => 'sometimes|nullable|date',
            'gender' => 'sometimes|nullable|string|max:10',
            'address' => 'sometimes|nullable|string|max:255',
            'phone' => 'sometimes|nullable|string|max:15',
            'email' => 'sometimes|nullable|string|email|max:255' . $id,
            'emergency_contact' => 'sometimes|nullable|string|max:255',
            'medical_history' => 'sometimes|nullable|string',
        ]);

        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found'
            ], 404);
        }

        $patient->update($request->all());

        return response()->json([
            'message' => 'Patient updated successfully',
            'patient' => $patient
        ], 200);
    }

    public function getMedicalHistory($id)
    {
        try {
            $medicalHistory = MedicalRecord::where('patient_id', $id)->get();
            return response()->json(['medicalHistory' => $medicalHistory]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to fetch medical history.'], 500);
        }
    }

    // Delete a specific patient by ID
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found'
            ], 404);
        }

        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully'
        ], 200);
    }
}
