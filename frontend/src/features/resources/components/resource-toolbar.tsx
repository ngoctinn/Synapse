"use client";

import { Input } from "@/shared/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function ResourceToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("query")?.toString() || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const onSearchChange = (val: string) => {
    setQuery(val);
    handleSearch(val);
  };

  const onClear = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <Input
      placeholder="Tìm kiếm tài nguyên..."
      value={query}
      onChange={(e) => onSearchChange(e.target.value)}
      startContent={<Search className="size-4 text-muted-foreground" />}
      endContent={
        query ? (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear</span>
          </button>
        ) : null
      }
      className="h-9 bg-background pr-8"
    />
  );
}
