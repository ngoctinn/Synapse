import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-success/15 text-success hover:bg-success/25",
        warning:
          "border-transparent bg-warning/15 text-warning hover:bg-warning/25",
        info:
          "border-transparent bg-info/15 text-info hover:bg-info/25",
        // Role-specific Semantic Colors (Mapped to Design System)
        purple:
          "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-800 dark:bg-purple-500/20 dark:text-purple-300 hover:bg-purple-500/20",
        indigo:
          "border-indigo-200 bg-indigo-500/10 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 hover:bg-indigo-500/20",
        // Visual Effects
        glass:
          "border-white/20 bg-black/40 text-white backdrop-blur-md shadow-sm",
        "glass-light":
          "border-white/40 bg-white/30 text-foreground backdrop-blur-md shadow-sm dark:bg-black/30 dark:border-white/10 dark:text-white",
        // Status variants (mới thêm để thay thế StatusBadge)
        "status-active":
          "border-primary/20 bg-primary/5 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]",
        "status-inactive":
          "border-border/50 bg-muted/50 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  asChild?: boolean
  /** Hiển thị indicator dot phía trước text */
  withIndicator?: boolean
  /** Animation pulse cho indicator (chỉ khi withIndicator=true) */
  indicatorPulse?: boolean
  /** Màu của indicator - mặc định theo variant */
  indicatorColor?: "primary" | "success" | "warning" | "destructive" | "muted"
}

function Badge({
  className,
  variant,
  asChild = false,
  withIndicator = false,
  indicatorPulse = false,
  indicatorColor,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  // Xác định màu indicator dựa trên variant hoặc prop indicatorColor
  const getIndicatorColorClass = () => {
    if (indicatorColor) {
      const colorMap = {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        destructive: "bg-destructive",
        muted: "bg-muted-foreground/40",
      }
      return colorMap[indicatorColor]
    }
    // Mặc định theo variant
    if (variant === "status-active" || variant === "success") return "bg-primary"
    if (variant === "status-inactive") return "bg-muted-foreground/40"
    return "bg-current"
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {withIndicator && (
        <span className="relative flex h-2 w-2 shrink-0">
          {indicatorPulse && (
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-20 animate-pulse", getIndicatorColorClass())} />
          )}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", getIndicatorColorClass())} />
        </span>
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
