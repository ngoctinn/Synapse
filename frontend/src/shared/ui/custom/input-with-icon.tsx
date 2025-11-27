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
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon: Icon, iconProps, rightIcon: RightIcon, rightIconProps, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon size={18} {...iconProps} />
          </div>
        )}
        <Input
          className={cn(
            Icon && "pl-10",
            RightIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {RightIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <RightIcon size={18} {...rightIconProps} />
          </div>
        )}
      </div>
    )
  }
)
InputWithIcon.displayName = "InputWithIcon"

export { InputWithIcon }
