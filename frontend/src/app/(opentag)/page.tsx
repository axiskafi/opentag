import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import React from "react";
import {
  authOptions,
  CustomSession,
} from "../api/auth/[...nextauth]/authOptions";
import { fetchPosts } from "@/dataFetch/postFetch";
import Posts from "@/components/post/Posts";

export default async function App() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const posts: ApiResponseType<PostType> = await fetchPosts(
    session?.user?.token!
  );
  return (
    <div>
      <Posts data={posts} user={session?.user!} />
    </div>
  );
}
