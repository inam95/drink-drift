"use client";

import { useQueryState } from "nuqs";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchInput() {
  const [name, setName] = useQueryState("query", {
    shallow: false,
    limitUrlUpdates: {
      method: "debounce",
      timeMs: 500
    }
  });

  return (
    <div className="group relative">
      <Input
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
        placeholder="Search cocktails by name"
        className="bg-yellow-text/5 focus-visible:ring-yellow-text/50 h-14 pr-4 pl-12 font-sans text-lg shadow-lg transition-all duration-300 focus:ring-0 focus:ring-offset-0"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="text-muted-foreground group-focus-within:text-primary h-6 w-6 transition-colors duration-300" />
      </div>
    </div>
  );
}
