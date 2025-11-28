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

export function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur-md transition-all",
        "border-border/50 hover:border-border",
        "dark:bg-zinc-900/95"
      )}
    >
      <div className={cn("flex-shrink-0 rounded-full p-1.5 mt-0.5", style.bg)}>
        <Icon size={18} className={style.color} strokeWidth={2.5} />
      </div>
      <div className="flex-1 grid gap-1">
        <h3 className="font-semibold text-sm leading-none tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed opacity-90">{description}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="flex-shrink-0 rounded-full p-1 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors -mr-1 -mt-1"
      >
        <X size={16} />
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
