"use client";

import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Icon } from "./icon";

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Tìm kiếm...", startContent, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        startContent={startContent || <Icon icon={Search} className="text-muted-foreground" />}
        className={cn("bg-background w-full md:w-[250px]", className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
