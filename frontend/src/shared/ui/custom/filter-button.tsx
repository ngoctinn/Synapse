"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { SlidersHorizontal, X } from "lucide-react"
import { ReactNode } from "react"

interface FilterButtonProps {
  /** Nội dung của bộ lọc (thường là các input hoặc checkbox) */
  children?: ReactNode
  /** Trạng thái active của bộ lọc (có đang lọc hay không) */
  isActive?: boolean
  /** Số lượng tiêu chí đang lọc */
  count?: number
  /** ClassName tùy chỉnh */
  className?: string
  /** Hàm callback khi người dùng xóa bộ lọc */
  onClear?: () => void
  /** Label hiển thị cạnh icon (nếu có sẽ chuyển sang dạng button thường) */
  label?: string
  /** Icon tùy chỉnh (mặc định là SlidersHorizontal) */
  icon?: React.ElementType
}

export function FilterButton({
  children,
  isActive = false,
  count = 0,
  className,
  onClear,
  label,
  icon: Icon = SlidersHorizontal,
}: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "outline"}
          size={label ? "default" : "icon"}
          className={cn(
            "relative shrink-0 transition-all duration-300",
            !label && "h-10 w-10",
            className
          )}
        >
          <Icon className={cn("h-4 w-4", label && "mr-2")} />
          {label}

          {count > 0 && (
            <span className={cn(
              "absolute flex h-4 w-4 animate-in zoom-in duration-300 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shadow-sm ring-2 ring-background",
              label ? "-right-1 -top-1" : "-right-1 -top-1"
            )}>
              {count}
            </span>
          )}
          <span className="sr-only">Bộ lọc</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end" collisionPadding={16}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Bộ lọc</h4>
            {count > 0 && onClear && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={onClear}
                title="Xóa bộ lọc"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Xóa lọc</span>
              </Button>
            )}
          </div>
          {children || (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground animate-in fade-in zoom-in duration-300">
              <SlidersHorizontal className="mb-2 h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">Chưa có bộ lọc</p>
              <p className="text-xs opacity-70">Vui lòng thêm tiêu chí lọc</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
