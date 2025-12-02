"use client"

import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/lib/utils"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface SearchInputProps {
  placeholder?: string
  className?: string
  searchKey?: string
}

export function SearchInput({
  placeholder = "Tìm kiếm...",
  className,
  searchKey = "search",
}: SearchInputProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(searchKey, term)
    } else {
      params.delete(searchKey)
    }
    // Reset page to 1 when searching
    params.set("page", "1")
    
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className={cn("relative flex-1 md:grow-0", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        defaultValue={searchParams.get(searchKey)?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
