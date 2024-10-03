"use client";
import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import PostCard from "./PostCard";
import { laraEcho, pvtlaraEcho } from "@/lib/echo.config";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";

export default function Posts({
  data,
  user,
}: {
  data: ApiResponseType<PostType>;
  user: CustomUser;
}) {
  const [posts, setPosts] = useState<ApiResponseType<PostType>>(data);
  //   const [posts, setPosts] = useImmer<ApiResponseType<PostType>>(data);
  useEffect(() => {
    if (laraEcho) {
      //   const pvtLaraEcho = pvtlaraEcho(user?.token!);
      //   pvtLaraEcho
      //     .private(`App.Models.User.${user.id}`)
      //     .listen("TestEvent", (event: any) => {
      //       console.log("the pvt real time data is", event);
      //     });
      //   return () => {
      //     pvtLaraEcho?.leave(`App.Models.User.${user.id}`);
      //   };

      laraEcho
        .channel("post-broadcast")
        .listen("PostBroadCastEvent", (event: any) => {
          console.log("the real time data is", event);
          const post: PostType = event.post;
          //   setPosts((prevState) => {
          //     prevState.data = [post, ...prevState.data];
          //   });
          setPosts((prevState) => ({
            ...prevState, // Copy the previous state object
            data: [post, ...prevState.data], // Create a new array with the new post prepended
          }));
        });
      return () => {
        laraEcho?.leave("post-broadcast");
      };
    }
  }, []);
  return (
    <div className="pt-4 p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {posts.data &&
        posts.data.length > 0 &&
        posts.data.map((item, index) => <PostCard post={item} key={index} />)}
    </div>
  );
}
