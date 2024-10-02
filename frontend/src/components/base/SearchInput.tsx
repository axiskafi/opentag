import { Search } from "lucide-react";
import React from "react";

export default function SearchInput() {
  return (
    <div className="relative hidden lg:block">
      <input
        className="w-full lg:w-[500px] h-12 p-2 outline-none bg-muted rounded-2xl px-10"
        placeholder="Search here...."
      />
      <Search className="absolute left-2 top-3 h-6 w-6" />
    </div>
  );
}
