<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Log;

class MedicalRecordController extends Controller
{
    /**
     * Store a new medical record.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        try {
            // Create a new MedicalRecord instance
            $record = new MedicalRecord([
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'visit_date' => $request->visit_date,
                'diagnosis' => $request->diagnosis,
                'treatment' => $request->treatment,
                'notes' => $request->notes,
            ]);

            // Save the record to the database
            $record->save();

            // Return a success response
            return response()->json(['message' => 'Medical record added successfully'], 201);
        } catch (\Exception $e) {
            // Log any errors encountered
            Log::error('Error saving medical record: ' . $e->getMessage());
            // Return an error response
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Display the medical records of a specific patient.
     *
     * @param int $patient_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($patient_id)
    {
        try {
            // Find the patient with the given ID
            $patient = Patient::find($patient_id);
    
            // If patient not found, return a 404 response
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }
    
            // Fetch medical records associated with the patient, eager loading doctor information
            $medicalRecords = MedicalRecord::where('patient_id', $patient_id)
                ->with('doctor:doctor_id,first_name,last_name')
                ->orderBy('visit_date', 'desc')
                ->get();
    
            // Return the medical records as JSON response
            return response()->json(['medical_records' => $medicalRecords]);
    
        } catch (\Exception $e) {
            // Log any errors encountered
            Log::error('Error fetching medical records for patient ' . $patient_id . ': ' . $e->getMessage());
    
            // Return an error response
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Display the medical records of a specific patient for the doctor.
     *
     * @param int $patient_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function doctorView($patient_id)
    {
        try {
            $patient = Patient::findOrFail($patient_id);
    
            $medicalRecords = MedicalRecord::where('patient_id', $patient_id)
                ->with('doctor:doctor_id,first_name,last_name')
                ->orderBy('visit_date', 'desc')
                ->get();
    
            return response()->json(['medical_records' => $medicalRecords]);
        } catch (\Exception $e) {
            Log::error('Error fetching medical records for patient ' . $patient_id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
