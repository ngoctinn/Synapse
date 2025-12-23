"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";

interface ServiceFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSearch: (query: string) => void;
}

export function ServiceFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch,
}: ServiceFilterProps) {
  return (
    <div className="mb-12 space-y-6">
      {/* Search Bar */}
      <div className="group relative mx-auto max-w-lg">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300" />
        <Input
          placeholder="Tìm kiếm liệu trình..."
          className="bg-background border-border hover:border-primary/50 focus:border-primary h-12 rounded-full pl-12 text-base shadow-sm transition-all"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory("All")}
          className={cn(
            "h-9 rounded-full px-6 transition-all duration-300",
            selectedCategory === "All"
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:scale-105"
              : "bg-background/50 hover:bg-muted/50 border-dashed backdrop-blur-sm hover:border-solid"
          )}
        >
          Tất cả
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "h-9 rounded-full px-6 transition-all duration-300",
              selectedCategory === cat
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:scale-105"
                : "bg-background/50 hover:bg-muted/50 border-dashed backdrop-blur-sm hover:border-solid"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
