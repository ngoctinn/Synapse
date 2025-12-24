"use client";

import { Input } from "@/shared/ui/input";
import { Search, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Icon } from "./icon";

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Tìm kiếm...", startContent, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        startContent={startContent || <Icon icon={Search} className="text-muted-foreground" />}
        endContent={
          props.value && String(props.value).length > 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (props.onChange) {
                  // Simulate event
                  const event = {
                    target: { value: "" },
                    currentTarget: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>;
                  props.onChange(event);
                }
                if (onSearch) onSearch("");
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-colors"
            >
              <Icon icon={X} className="size-3.5" />
            </button>
          ) : undefined
        }
        className={cn("bg-background w-full md:w-[250px]", className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
