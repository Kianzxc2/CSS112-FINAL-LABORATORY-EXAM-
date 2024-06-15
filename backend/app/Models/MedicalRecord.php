<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;

class MedicalRecordController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $record = MedicalRecord::create($request->all());

        return response()->json(['message' => 'Medical record added successfully'], 201);
    }

    public function index($patient_id)
    {
        $patient = Patient::findOrFail($patient_id);

        $medicalRecords = MedicalRecord::where('patient_id', $patient_id)
            ->with('doctor:id,first_name,last_name')
            ->get();

        return response()->json(['medical_records' => $medicalRecords]);
    }

    public function doctorView($patient_id)
    {
        $medicalRecords = MedicalRecord::where('patient_id', $patient_id)
            ->with('doctor:id,first_name,last_name')
            ->orderBy('visit_date', 'desc')
            ->get();

        return response()->json(['medical_records' => $medicalRecords]);
    }
}
