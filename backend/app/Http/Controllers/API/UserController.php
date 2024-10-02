<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function updateProfileImage(Request $request)
    {
        $payLoad = $request->validate([
            "profile_image" => "required|image|mimes:jpg,png,svg,webp,jpeg|max:2048",
        ]);
        try {
            $user = $request->user();
            $fileName = $payLoad['profile_image']->store('images_' . $user->id);
            User::where("id", $user->id)->update(["profile_image" => $fileName]);
            return response()->json(["message" => "Successfully Updated Profile Image", "image" => $fileName], 200);
        } catch (\Exception $err) {
            Log::info("Profile Image error =>" . $err->getMessage());
            return response()->json(["message" => "Something went wrong."], 500);
        }
    }
}
