<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointment = Appointment::all();
        return response()->json(['appointments' => $appointment]);
    }
    public function bookAppointment(Request $request)
    {
        // dd($request);
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'appointment_date' => 'required|date',
            'reason' => 'required|string|max:255'
        ]);
        
        $appointment = new Appointment();
        $appointment->patient_id = $request->patient_id;
        $appointment->doctor_id = $request->doctor_id;
        $appointment->appointment_date = $request->appointment_date;
        $appointment->status = 'pending'; // Default to 'pending'
        $appointment->reason = $request->reason;
        $appointment->save();
        

        return response()->json(['message' => 'Appointment booked successfully', 'appointment' => $appointment]);
    }

    public function rescheduleAppointment(Request $request, $id)
    {
        $request->validate([
            'appointment_date' => 'required|date'
        ]);
        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->appointment_date = $request->input('appointment_date');
            $appointment->save();
            return response()->json(['appointment' => $appointment], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating appointment.', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Appointment approved successfully', 'appointment' => $appointment]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'appointment_date' => 'required|date',
            'status' => 'required|string|max:255',
            'reason' => 'required|string|max:255',
        ]);

        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->patient_id = $validatedData['patient_id'];
            $appointment->doctor_id = $validatedData['doctor_id'];
            $appointment->appointment_date = $validatedData['appointment_date'];
            $appointment->status = $validatedData['status'];
            $appointment->reason = $validatedData['reason'];
            $appointment->save();

            return response()->json(['message' => 'Appointment updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating appointment', 'error' => $e->getMessage()], 500);
        }
    }
    public function confirmAppointment($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->status = 'confirmed';
        $appointment->save();

        return response()->json(['message' => 'Appointment approved successfully', 'appointment' => $appointment]);
    }

    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed'
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->status = $request->get('status');
        $appointment->save();

        return response()->json(['message' => 'Appointment status updated successfully!']);
    }

    /**
     * Deny an appointment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancelAppointment($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json(['message' => 'Appointment canceled successfully', 'appointment' => $appointment]);
    }

    /**
     * Mark appointment as done.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function doneAppointment($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->status = 'completed';
        $appointment->save();

        return response()->json(['message' => 'Appointment marked as done successfully', 'appointment' => $appointment]);
    }

    public function delete($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'message' => 'appointment not found'
            ], 404);
        }

        $appointment->delete();

        return response()->json([
            'message' => 'appointment deleted successfully'
        ], 200);
    }

    /**
     * Fetch appointments for a specific doctor.
     *
     * @param int $doctor_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function doctorAppointments($doctor_id)
    {
        // Find the doctor with the given ID
        $doctor = Doctor::find($doctor_id);

        // If doctor not found, return a 404 response
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Fetch appointments associated with the doctor
        $appointments = Appointment::where('doctor_id', $doctor_id)->get();

        // Return the appointments as JSON response
        return response()->json(['appointments' => $appointments]);
    }
}
