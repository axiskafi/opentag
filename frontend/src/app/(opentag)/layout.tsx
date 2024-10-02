import Navbar from "@/components/base/Navbar";
import Sidebar from "@/components/base/Sidebar";
import { getServerSession } from "next-auth";
import React from "react";

export default async function OpenTagLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-y-hidden">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex justify-center items-center w-full overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
