"use client"

import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/shared/lib/utils"
import { ListFilter } from "lucide-react"
import { ReactNode } from "react"

interface FilterButtonProps {
  children?: ReactNode
  isActive?: boolean
  count?: number
  className?: string
}

export function FilterButton({
  children,
  isActive = false,
  count = 0,
  className,
}: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative h-10 w-10 shrink-0",
            isActive && "bg-accent text-accent-foreground border-primary/50",
            className
          )}
        >
          <ListFilter className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shadow-sm">
              {count}
            </span>
          )}
          <span className="sr-only">Bộ lọc</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        {children || (
          <div className="flex flex-col items-center justify-center py-4 text-center text-sm text-muted-foreground">
            <p>Chức năng lọc đang được phát triển</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
