
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
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm dịch vụ..."
          className="pl-9 h-12 rounded-xl bg-background border-muted hover:border-primary/50 focus:border-primary transition-all shadow-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex justify-center overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory("All")}
          className={cn(
            "rounded-full whitespace-nowrap transition-all",
            selectedCategory === "All" ? "shadow-md" : "border-dashed opacity-70 hover:opacity-100"
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
              "rounded-full whitespace-nowrap transition-all",
              selectedCategory === cat ? "shadow-md" : "border-dashed opacity-70 hover:opacity-100"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  )
}
