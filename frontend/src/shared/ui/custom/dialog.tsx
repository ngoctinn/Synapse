"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { AlertTriangle, CheckCircle2, Info, LucideIcon, XCircle } from "lucide-react"

type DialogVariant = "success" | "info" | "warning" | "error"

interface CustomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: DialogVariant
  icon?: LucideIcon
  title: string
  description: string
  primaryAction?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const variantStyles = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-500",
    bg: "bg-emerald-100/50 dark:bg-emerald-500/10",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-500",
    bg: "bg-blue-100/50 dark:bg-blue-500/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-500",
    bg: "bg-amber-100/50 dark:bg-amber-500/10",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-500",
    bg: "bg-red-100/50 dark:bg-red-500/10",
  },
}

export function CustomDialog({
  open,
  onOpenChange,
  variant = "info",
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: CustomDialogProps) {
  const style = variantStyles[variant]
  const Icon = icon || style.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 gap-6 border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Icon with subtle glow */}
          <div className={cn("rounded-full p-3 mb-2 transition-all duration-500", style.bg)}>
            <Icon className={cn("h-6 w-6", style.color)} strokeWidth={2.5} />
          </div>

          <DialogHeader className="gap-2">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="w-full sm:flex-1 h-10 rounded-xl border-muted-foreground/20 hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant={primaryAction.variant || "default"}
              onClick={primaryAction.onClick}
              className="w-full sm:flex-1 h-10 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
            >
              {primaryAction.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
