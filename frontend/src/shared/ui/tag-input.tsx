"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import * as React from "react";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

/**
 * Input cho phép nhập nhiều Tag (Thẻ/Kỹ năng).
 * Tự động thêm tag khi nhấn Enter hoặc dấu phẩy.
 */
export function TagInput({
  value = [],
  onChange,
  placeholder = "Nhập thẻ và nhấn Enter...",
  className,
  maxTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !value.includes(trimmedInput)) {
      if (maxTags && value.length >= maxTags) return;
      onChange([...value, trimmedInput]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div
      className={cn(
        "border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2",
        className
      )}
    >
      {value.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="animate-in fade-in zoom-in flex items-center gap-1 py-0.5 pr-1.5 text-xs duration-200"
        >
          {tag}
          <button
            type="button"
            className="hover:bg-muted focus:ring-ring ml-1 rounded-full outline-none focus:ring-1"
            onClick={() => removeTag(index)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Xóa {tag}</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-7 flex-1 border-none bg-transparent p-0 pl-1 text-sm focus-visible:ring-0"
      />
    </div>
  );
}
