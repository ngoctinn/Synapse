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
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-transparent",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/10 to-transparent",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/10 to-transparent",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    gradient: "from-red-500/10 to-transparent",
  },
}

export function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-md",
        "dark:bg-zinc-900/80",
        style.border
      )}
      role="alert"
    >
      {/* Gradient Background Effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none",
          style.gradient
        )}
      />

      <div className="relative flex w-full items-start gap-3">
        {/* Icon */}
        <div className={cn("flex-shrink-0 rounded-full p-1", style.bg)}>
          <Icon size={18} className={style.color} strokeWidth={2.5} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 grid gap-1">
          <h3 className="font-semibold text-sm leading-none tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed opacity-90">
              {description}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t)}
          className="flex-shrink-0 rounded-full p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors -mr-1 -mt-1"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
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
