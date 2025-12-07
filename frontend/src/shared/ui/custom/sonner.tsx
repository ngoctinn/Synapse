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
  duration?: number
}

// Sử dụng CSS variables trực tiếp vì Tailwind class utilities chưa nhận diện đầy đủ
const variantStyles = {
  success: {
    icon: CheckCircle2,
    colorVar: "var(--alert-success-foreground)",
    bgVar: "var(--alert-success)",
    borderVar: "var(--alert-success-border)",
    srLabel: "Thành công",
  },
  info: {
    icon: Info,
    colorVar: "var(--alert-info-foreground)",
    bgVar: "var(--alert-info)",
    borderVar: "var(--alert-info-border)",
    srLabel: "Thông tin",
  },
  warning: {
    icon: AlertTriangle,
    colorVar: "var(--alert-warning-foreground)",
    bgVar: "var(--alert-warning)",
    borderVar: "var(--alert-warning-border)",
    srLabel: "Cảnh báo",
  },
  error: {
    icon: XCircle,
    colorVar: "var(--destructive)",
    bgVar: "oklch(0.65 0.22 25 / 0.1)",
    borderVar: "oklch(0.65 0.22 25 / 0.2)",
    srLabel: "Lỗi",
  },
}

export function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur-xl",
        "motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-md",
        "dark:bg-zinc-900/80"
      )}
      style={{ borderColor: style.borderVar }}
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {/* Screen reader only - đọc loại thông báo */}
      <span className="sr-only">{style.srLabel}: </span>

      {/* Gradient Background Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${style.bgVar}, transparent)`
        }}
        aria-hidden="true"
      />

      <div className="relative flex w-full items-start gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 rounded-full p-1.5"
          style={{ backgroundColor: style.bgVar }}
        >
          <Icon
            size={18}
            style={{ color: style.colorVar }}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex-1 grid gap-1 pt-0.5">
          <h3 className="font-semibold text-sm leading-none tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed opacity-90">
              {description}
            </p>
          )}
        </div>

        {/* Close Button - Touch target 44x44px */}
        <button
          onClick={() => toast.dismiss(t)}
          className={cn(
            "flex-shrink-0 flex items-center justify-center",
            "min-w-[44px] min-h-[44px] -mr-3 -mt-3",
            "rounded-full text-muted-foreground/60",
            "hover:text-foreground hover:bg-muted/50",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            "motion-safe:transition-colors"
          )}
          aria-label="Đóng thông báo"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

interface ShowToastOptions {
  duration?: number
}

export const showToast = {
  success: (title: string, description?: string, options?: ShowToastOptions) =>
    toast.custom(
      (t) => <CustomToast variant="success" title={title} description={description} t={t} />,
      { duration: options?.duration }
    ),
  info: (title: string, description?: string, options?: ShowToastOptions) =>
    toast.custom(
      (t) => <CustomToast variant="info" title={title} description={description} t={t} />,
      { duration: options?.duration }
    ),
  warning: (title: string, description?: string, options?: ShowToastOptions) =>
    toast.custom(
      (t) => <CustomToast variant="warning" title={title} description={description} t={t} />,
      { duration: options?.duration }
    ),
  error: (title: string, description?: string, options?: ShowToastOptions) =>
    toast.custom(
      (t) => <CustomToast variant="error" title={title} description={description} t={t} />,
      { duration: options?.duration }
    ),
}
