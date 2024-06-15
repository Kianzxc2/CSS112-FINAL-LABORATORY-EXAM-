<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;

class DoctorController extends Controller
{
    // Fetch all doctors
    public function index()
    {
        $doctors = Doctor::all();
        return response()->json(['doctors' => $doctors], 200);
    }

    // Add a new doctor
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|integer',
            'doctor_id' => 'required|integer',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
        ]);
    
        // Create medical record using $validated data
        // Example:
        $medicalRecord = MedicalRecord::create($validated);
        return response()->json($medicalRecord, 201);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }        

        $user = new User();
        $user->name = $request->first_name." ".$request->last_name;
        $user->email = $request->email;
        $user->role = 'doctor';
        $user->password = Hash::make($request->password);
        $user->save();
        $doctor = new Doctor();
        $doctor->user_id = $user->id;
        $doctor->user_id = $user->id; 
        $doctor->first_name = $request->first_name;
        $doctor->last_name = isset($request->last_name) ? $request->last_name : '';
        $doctor->specialization = $request->specialization; 
        $doctor->license_number = $request->license_number; 
        $doctor->phone = $request->phone; 
        $doctor->email = $user->email;
        $doctor->created_at = now();
        $doctor->updated_at = now();
        $doctor->save();
        return response()->json(['doctor' => $doctor], 201);
    }

    // Fetch a single doctor by ID
    public function show($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        return response()->json(['doctor' => $doctor], 200);
    }

    // Update a doctor's details
    public function update(Request $request, $id)
{
    $doctor = Doctor::find($id);

    if (!$doctor) {
        return response()->json(['error' => 'Doctor not found'], 404);
    }

    $validator = Validator::make($request->all(), [
        'first_name' => 'sometimes|nullable|string|max:255',
        'last_name' => 'sometimes|nullable|string|max:255',
        'specialization' => 'sometimes|nullable|string|max:255',
        'license_number' => 'sometimes|nullable|string|max:255|unique:doctors,license_number,' . $id . ',doctor_id',
        'phone' => 'sometimes|nullable|string|max:20',
        'email' => 'sometimes|nullable|string|email|max:255|unique:doctors,email,' . $id . ',doctor_id',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $doctor->fill($request->all());
    $doctor->save();

    return response()->json(['doctor' => $doctor], 200);
}

    public function destroy($id)
    {
        $doctor = Doctor::find($id);
        $user = User::find($doctor->user_id);
        // Find the doctor record by user_id instead of doctor's ID
        
        if (!$doctor) {
            $doctor = Doctor::where('id', $id)->first();
            $user = User::where('id', $doctor->user_id)->first();
            if (!$doctor) {
                return response()->json(['message' => 'Doctor not found'], 404);
            }
        
            $doctor->delete();
            $user->delete();
            return response()->json(['message' => 'Doctor deleted successfully'], 200);
        }
        $user->delete();
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully'], 200);
    }
}
