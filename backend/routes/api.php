<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post("/auth/logout", [AuthController::class, 'logout'])->name('logout');
    Route::post("/update/profile", [UserController::class, 'updateProfileImage'])->name('updateProfileImage');
});

Route::post("/auth/register", [AuthController::class, 'register'])->name('register');
Route::post("/auth/checkCredentials", [AuthController::class, 'checkCredentials'])->name('checkCredentials');
Route::post("/auth/login", [AuthController::class, 'login'])->name('login');
