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
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-900",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-900",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-900",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900",
  },
}

export function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg transition-all",
        "bg-white dark:bg-gray-950", // Base background
        style.border
      )}
    >
      <div className={cn("flex-shrink-0 rounded-full p-2", style.bg)}>
        <Icon size={16} className={style.color} />
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
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
