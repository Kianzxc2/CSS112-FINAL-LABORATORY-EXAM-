<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        //$this->middleware('auth'); 
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'patient', // Set the role to 'user' or any default role
            ]);
    
            return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
        } catch (\Exception $e) {
            // Log the error for investigation
            \Log::error('User registration failed: ' . $e->getMessage());
    
            return response()->json(['error' => 'Registration failed. Please try again later.'], 500);
        }
    }
    
    /**
     * Authenticate a user and return a token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('name', 'password');

            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                $token = $user->createToken('authToken')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user], 200);
            }

            return response()->json(['message' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            // Log the error for investigation
            \Log::error('User login failed: ' . $e->getMessage());

            return response()->json(['error' => 'Login failed. Please try again later.'], 500);
        }
    }
}
