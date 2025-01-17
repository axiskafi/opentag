<?php

use App\Events\PostBroadCastEvent;
use App\Events\TestEvent;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\UserController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post("/auth/logout", [AuthController::class, 'logout'])->name('logout');
    Route::post("/update/profile", [UserController::class, 'updateProfileImage'])->name('updateProfileImage');
    Route::apiResources([
        "post" => PostController::class
    ]);
});

Route::post("/auth/register", [AuthController::class, 'register'])->name('register');
Route::post("/auth/checkCredentials", [AuthController::class, 'checkCredentials'])->name('checkCredentials');
Route::post("/auth/login", [AuthController::class, 'login'])->name('login');

Route::post("/test/channel", function () {
    $post = Post::select()->with("user")->orderByDesc("id")->first();
    TestEvent::dispatch($post);
    return response()->json(["message" => "Data sent to clients"]);
});

Route::post("/post/channel", function () {
    $post = Post::select()->with("user")->orderByDesc("id")->first();
    PostBroadCastEvent::dispatch($post);
    return response()->json(["message" => "Data sent to clients"]);
});

Broadcast::routes(["middleware" => ["auth:sanctum"]]);
