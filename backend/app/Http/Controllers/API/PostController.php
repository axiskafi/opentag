<?php

namespace App\Http\Controllers\API;

use App\Events\PostBroadCastEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::select()->with("user")->orderbyDesc('id')->cursorPaginate(20);
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $payLoad = $request->validated();

        try {
            $user = $request->user();
            $payLoad['user_id'] = $user->id;
            $post = Post::create($payLoad)->with("user")->orderByDesc("id")->first();
            //Dispatch Event send new post to all online users
            PostBroadCastEvent::dispatch($post);
            return response()->json(["message" => "Post Created Successfully", "post" => $post], 200);
        } catch (\Error $err) {
            Log::info("Post error =>" . $err->getMessage());
            return response()->json(["message" => "Something went wrong."], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
