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
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/30",
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
      <DialogContent className="sm:max-w-[425px] text-center">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {/* Signal Emphasis Pattern */}
          <div className={cn("rounded-full p-3", style.bg)}>
            <div className={cn("rounded-full bg-white dark:bg-gray-950 p-2 shadow-sm")}>
              <Icon className={cn("h-8 w-8", style.color)} />
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-xl">{title}</DialogTitle>
            <DialogDescription className="text-center text-base">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || "default"}
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {primaryAction.label}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
