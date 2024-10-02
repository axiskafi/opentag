<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $payload = $request->validated();
        try {
            $payload['password'] = Hash::make($payload['password']);
            User::create($payload);
            return response()->json(["status" => 200, "message" => "Account created successfully!"], 200);
        } catch (\Exception $err) {
            Log::info("Register error =>" . $err->getMessage());
            return response()->json(["message" => "Something went wrong."], 500);
        }
    }

    public function login(Request $request)
    {
        $payload = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        try {
            $user = User::where("email", $payload["email"])->first();
            if ($user) {
                //check password
                if (!Hash::check($payload["password"], $user->password)) {
                    return response()->json(["status" => 401, "message" => "invalid Crednetials"], 401);
                }
                $token = $user->createToken("web")->plainTextToken;
                $authRes = array_merge($user->toArray(), ["token" => $token]);
                return response()->json(["message" => "Logged in successfully", "user" => $authRes], 200);
            }
            return response()->json(["status" => 401, "message" => "No account found with these credentials."], 401);
        } catch (\Exception $err) {
            Log::info("Login error =>" . $err->getMessage());
            return response()->json(["message" => "Something went wrong."], 500);
        }
    }

    public function checkCredentials(Request $request)
    {
        $payload = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        try {
            $user = User::where("email", $payload["email"])->first();
            if ($user) {
                // * Check password
                if (!Hash::check($payload["password"], $user->password)) {
                    return response()->json(["status" => 401, "message" => "Invalid credentials."], 401);
                }
                return ["status" => 200, "message" => "Loggedin succssfully!"];
            }
            return response()->json(["status" => 401, "message" => "No account found with these credentials."], 401);
        } catch (\Exception $err) {
            Log::info("user_register_err =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return ["message" => "Logged out successfully"];
        } catch (\Exception $err) {
            Log::info("Logout error =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }
}
