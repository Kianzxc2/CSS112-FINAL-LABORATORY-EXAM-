<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Doctor;
use App\Models\Patient;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    public function addUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:admin,doctor,receptionist,patient',
            'password' => 'required|min:6',
        ]);
    
        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);
    
            // Handle role-specific logic
            if ($user->role === 'doctor') {
                $nameParts = explode(' ', $user->name);
                $doctor = new Doctor();
                $doctor->user_id = $user->id;
                $doctor->first_name = $nameParts[0];
                $doctor->last_name = isset($nameParts[1]) ? $nameParts[1] : '';
                $doctor->specialization = '';
                $doctor->license_number = '';
                $doctor->phone = '';
                $doctor->email = $user->email;
                $doctor->save();
            } elseif ($user->role === 'patient') {
                $nameParts = explode(' ', $user->name);
                $patient = new Patient();
                $patient->user_id = $user->id;
                $patient->first_name = $nameParts[0];
                $patient->last_name = isset($nameParts[1]) ? $nameParts[1] : '';
                $patient->date_of_birth = '2001-01-01';
                $patient->gender = 'other';
                $patient->address = '';
                $patient->phone = '';
                $patient->email = $user->email;
                $patient->emergency_contact = '';
                $patient->medical_history = '';
                $patient->save();
            }
    
            return response()->json(['message' => 'User added successfully', 'user' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add user', 'message' => $e->getMessage()], 500);
        }
    }
    

    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|in:admin,doctor,receptionist,patient'
        ]);

        $user = User::findOrFail($id);
        $user->update($request->all());

        if ($user->role == 'doctor') {
            $nameParts = explode(' ', $user->name);
            $doctor = new Doctor();
            $doctor->user_id = $user->id; 
            $doctor->first_name = $nameParts[0];
            $doctor->last_name = isset($nameParts[1]) ? $nameParts[1] : '';
            $doctor->specialization = ''; 
            $doctor->license_number = ''; 
            $doctor->phone = ''; 
            $doctor->email = $user->email;
            $doctor->created_at = now();
            $doctor->updated_at = now();
            $doctor->save();
        }else if ($user->role == 'patient') {
            $nameParts = explode(' ', $user->name);
            $patient = new Patient();
            $patient->user_id = $user->id;
            $patient->first_name = $nameParts[0];
            $patient->last_name = isset($nameParts[1]) ? $nameParts[1] : ' ';
            $patient->date_of_birth = '2001-01-01'; 
            $patient->gender = 'other'; 
            $patient->address = ' '; 
            $patient->phone = ' ';
            $patient->email = $user->email;
            $patient->emergency_contact = ' ';
            $patient->medical_history = ' ';
            $patient->created_at = now();
            $patient->updated_at = now();
            $patient->save();
        }
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user]);
    }
}
