"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Eye, EyeOff, Lock, LucideIcon, LucideProps } from "lucide-react"
import * as React from "react"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  iconProps?: LucideProps
  /**
   * Variant size cho PasswordInput
   * - `default`: h-10 - kích thước mặc định
   * - `lg`: h-12 - kích thước lớn cho form chính (login, register)
   * - `sm`: h-9 - kích thước nhỏ gọn
   */
  variant?: "default" | "lg" | "sm"
}

const sizeVariants = {
  sm: "h-9",
  default: "h-10",
  lg: "h-12",
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon, iconProps, variant = "default", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const Icon = icon || Lock

    return (
      <div className="relative group w-full">
          <div className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
            props["aria-invalid"] ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary/70"
          )}>
            <Icon size={18} {...iconProps} />
          </div>
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            sizeVariants[variant],
            "bg-background border-input/50 rounded-lg",
            "pl-10",
            "pr-10",
            "transition-all duration-200 shadow-sm",
            "hover:shadow-md hover:border-input",
            "focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50",
            props["aria-invalid"] && "border-destructive/50 focus-visible:ring-destructive/20 focus-visible:border-destructive/50",
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-colors duration-200 z-10",
            "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            props["aria-invalid"] ? "text-destructive/70 hover:text-destructive" : ""
          )}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

