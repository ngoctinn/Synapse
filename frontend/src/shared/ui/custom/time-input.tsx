"use client"

import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/input"
import * as React from "react"

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Variant size cho TimeInput
   * - `default`: h-10 - kích thước mặc định
   * - `lg`: h-12 - kích thước lớn
   * - `sm`: h-9 - kích thước nhỏ gọn
   */
  variant?: "default" | "lg" | "sm"
}

const sizeVariants = {
  sm: "h-9",
  default: "h-10",
  lg: "h-12",
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <Input
        type="time"
        className={cn(
          // Base styles - Premium look
          sizeVariants[variant],
          "bg-background border-input/50 rounded-lg",
          // Transitions và shadows
          "transition-all duration-200 shadow-sm",
          "hover:shadow-md hover:border-input",
          // Focus states - Softer, more elegant
          "focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TimeInput.displayName = "TimeInput"

export { TimeInput }
