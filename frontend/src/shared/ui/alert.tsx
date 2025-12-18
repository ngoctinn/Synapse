import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive border-destructive/50 bg-destructive/5 dark:bg-destructive/10 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        success:
          "text-alert-success-foreground border-alert-success-border bg-alert-success/50 dark:bg-alert-success [&>svg]:text-current *:data-[slot=alert-description]:text-alert-success-foreground/90",
        warning:
          "text-alert-warning-foreground border-alert-warning-border bg-alert-warning/50 dark:bg-alert-warning [&>svg]:text-current *:data-[slot=alert-description]:text-alert-warning-foreground/90",
        info:
          "text-alert-info-foreground border-alert-info-border bg-alert-info/50 dark:bg-alert-info [&>svg]:text-current *:data-[slot=alert-description]:text-alert-info-foreground/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
