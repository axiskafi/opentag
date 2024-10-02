import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function App() {
  const session = await getServerSession(authOptions);
  return <div>Hey I am App file</div>;
}
