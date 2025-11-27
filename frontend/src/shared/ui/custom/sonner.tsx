"use client"

import { cn } from "@/shared/lib/utils"
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { toast } from "sonner"

type ToastVariant = "success" | "info" | "warning" | "error"

interface CustomToastProps {
  variant: ToastVariant
  title: string
  description?: string
  t: string | number
}

const variantStyles = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-500",
    bg: "bg-green-100/50 dark:bg-green-900/20",
    borderLeft: "border-l-green-500",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-500",
    bg: "bg-blue-100/50 dark:bg-blue-900/20",
    borderLeft: "border-l-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-500",
    bg: "bg-amber-100/50 dark:bg-amber-900/20",
    borderLeft: "border-l-amber-500",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-500",
    bg: "bg-red-100/50 dark:bg-red-900/20",
    borderLeft: "border-l-red-500",
  },
}

export function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border border-border/50 p-4 shadow-lg transition-all", // items-center, gap-4, rounded-xl
        "bg-background/95 backdrop-blur-md",
        "border-l-[6px]", // Thicker left border
        style.borderLeft
      )}
    >
      <div className={cn("flex-shrink-0 rounded-full p-2", style.bg)}> {/* Reduced padding */}
        <Icon size={20} className={style.color} /> {/* Reduced icon size */}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3> {/* text-sm */}
        {description && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="flex-shrink-0 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" // rounded-full, p-2
      >
        <X size={18} />
      </button>
    </div>
  )
}

export const showToast = {
  success: (title: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast variant="success" title={title} description={description} t={t} />
    )),
  info: (title: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast variant="info" title={title} description={description} t={t} />
    )),
  warning: (title: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast variant="warning" title={title} description={description} t={t} />
    )),
  error: (title: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast variant="error" title={title} description={description} t={t} />
    )),
}
