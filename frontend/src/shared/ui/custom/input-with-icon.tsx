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
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, containerClassName, icon: Icon, iconProps, rightIcon: RightIcon, rightIconProps, error, ...props }, ref) => {
    return (
      <div className={cn("relative group w-full", containerClassName)}>
        {Icon && (
          <div className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
            !error && "text-muted-foreground group-focus-within:text-primary",
            error && "text-destructive group-focus-within:text-destructive"
          )}>
            <Icon size={18} {...iconProps} />
          </div>
        )}
        <Input
          className={cn(
            "transition-all duration-200 shadow-sm hover:shadow-md focus-visible:shadow-md",
            "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
            Icon && "pl-10",
            RightIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {RightIcon && (
          <div className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
            !error && "text-muted-foreground group-focus-within:text-primary",
            error && "text-destructive group-focus-within:text-destructive"
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

