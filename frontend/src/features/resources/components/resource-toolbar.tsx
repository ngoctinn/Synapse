"use client";

import { useSearchParam } from "@/shared/hooks/use-search-param";
import { Input } from "@/shared/ui/input";
import { Loader2, Search, X } from "lucide-react";

export function ResourceToolbar() {
  const { value, setValue, clear, isPending } = useSearchParam({
    paramName: "query",
    debounceMs: 300,
    resetParams: ["page"],
  });

  return (
    <div role="search" aria-label="Tìm kiếm tài nguyên">
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm tài nguyên..."
        aria-label="Tìm kiếm tài nguyên"
        startContent={<Search className="size-4" />}
        endContent={
          isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : value ? (
            <button
              type="button"
              onClick={clear}
              className="hover:bg-muted rounded-full p-0.5 transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X className="size-3" />
              <span className="sr-only">Xóa</span>
            </button>
          ) : null
        }
        className="bg-background"
      />
    </div>
  );
}
