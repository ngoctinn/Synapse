
"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Search } from "lucide-react"

interface ServiceFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  onSearch: (query: string) => void
}

export function ServiceFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch
}: ServiceFilterProps) {
  return (
    <div className="space-y-6 mb-12">
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        <Input
          placeholder="Tìm kiếm liệu trình..."
          className="pl-10 h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted hover:border-primary/50 focus:border-primary transition-all shadow-sm text-base"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex justify-center flex-wrap gap-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory("All")}
          className={cn(
            "rounded-full px-6 h-9 transition-all duration-300",
            selectedCategory === "All"
              ? "shadow-md bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
              : "bg-background/50 backdrop-blur-sm border-dashed hover:border-solid hover:bg-muted/50"
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
              "rounded-full px-6 h-9 transition-all duration-300",
              selectedCategory === cat
                ? "shadow-md bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                : "bg-background/50 backdrop-blur-sm border-dashed hover:border-solid hover:bg-muted/50"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  )
}
