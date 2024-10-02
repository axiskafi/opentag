import React from "react";
import SidebarLinks from "./SidebarLinks";

export default function Sidebar() {
  return (
    <div className="hidden lg:block w-[260px] border-r p-4 h-full">
      <SidebarLinks />
    </div>
  );
}
