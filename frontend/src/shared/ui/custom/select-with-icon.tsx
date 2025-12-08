import { cn } from "@/shared/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { LucideIcon } from "lucide-react"

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
}: SelectWithIconProps) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
          <Icon size={18} />
        </div>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          aria-invalid={!!isError}
          className={cn(
            "!h-10 w-full rounded-lg bg-background",
            "shadow-sm hover:shadow-md hover:border-input transition-all duration-200",
            "focus-premium",

            isError && "border-destructive/50",

            "text-foreground text-sm",
            Icon ? "pl-10" : "px-3",
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
