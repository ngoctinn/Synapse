import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/input"
import { LucideIcon, LucideProps } from "lucide-react"
import * as React from "react"

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  iconProps?: LucideProps
  rightIcon?: LucideIcon
  rightIconProps?: LucideProps
  error?: boolean | string
  containerClassName?: string
  /**
   * Variant size cho Input
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

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({
    className,
    containerClassName,
    icon: Icon,
    iconProps,
    rightIcon: RightIcon,
    rightIconProps,
    error,
    variant = "default",
    ...props
  }, ref) => {
    const isError = error || props["aria-invalid"];

    return (
      <div className={cn("relative group w-full", containerClassName)}>
        {Icon && (
          <div className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
            isError ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
          )}>
            <Icon size={18} {...iconProps} />
          </div>
        )}
        <Input
          className={cn(
            // Base styles - Premium look
            // Base styles - Premium look
            sizeVariants[variant],
            "bg-background rounded-lg",
            // Transitions và shadows
            "transition-all duration-200 shadow-sm",
            "hover:shadow-md hover:border-input",
            // Focus states (Global handles invalid state now)
            "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",

            // Icon padding
            Icon && "pl-10",
            RightIcon && "pr-10",

            // Error styling (Border only, focus ring handled by globals)
            isError && "border-destructive/50",

            className
          )}
          ref={ref}
          aria-invalid={!!isError}
          {...props}
        />
        {RightIcon && (
          <div className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
            isError ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
          )}>
            <RightIcon size={18} {...rightIconProps} />
          </div>
        )}
      </div>
    )
  }
)
InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }

