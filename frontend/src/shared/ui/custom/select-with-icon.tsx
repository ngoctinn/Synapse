import { cn } from "@/shared/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { LucideIcon } from "lucide-react"
import * as React from "react"

interface SelectWithIconProps {
  icon?: LucideIcon
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  options: { label: string; value: string }[]
  className?: string
  isError?: boolean
}

export function SelectWithIcon({
  icon: Icon,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  disabled,
  options,
  className,
  isError,
  ...props
}: SelectWithIconProps & React.ComponentPropsWithoutRef<typeof Select>) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
          isError ? "text-destructive" : "text-muted-foreground"
        )}>
          <Icon size={18} />
        </div>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        {...props}
      >
        <SelectTrigger
          aria-invalid={!!isError}
          className={cn(
            "h-10 w-full rounded-lg bg-background",
            "pl-10", // Always pad left because icon space is reserved or it looks better aligned
            Icon ? "pl-10" : "px-3",
            "shadow-sm hover:shadow-md hover:border-input transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
            isError && "border-destructive/50 focus:ring-destructive/20 focus:border-destructive/50",
            "text-foreground text-sm",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
