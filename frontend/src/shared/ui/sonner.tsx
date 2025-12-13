"use client"

import { cn } from "@/shared/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  CircleCheckIcon,
  Info,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  X,
  XCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

// ==========================================
// CUSTOM TOAST IMPLEMENTATION
// ==========================================

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
    container: "border-success/20 bg-success/10",
    iconBg: "bg-success/20",
    iconColor: "text-success",
    title: "text-foreground",
    desc: "text-muted-foreground",
    srLabel: "Thành công",
    gradient: "from-success/10 to-transparent",
  },
  info: {
    icon: Info,
    container: "border-info/20 bg-info/10",
    iconBg: "bg-info/20",
    iconColor: "text-info",
    title: "text-foreground",
    desc: "text-muted-foreground",
    srLabel: "Thông tin",
    gradient: "from-info/10 to-transparent",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-warning/20 bg-warning/10",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    title: "text-foreground",
    desc: "text-muted-foreground",
    srLabel: "Cảnh báo",
    gradient: "from-warning/10 to-transparent",
  },
  error: {
    icon: XCircle,
    container: "border-destructive/20 bg-destructive/5",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    title: "text-foreground",
    desc: "text-muted-foreground",
    srLabel: "Lỗi",
    gradient: "from-destructive/10 to-transparent",
  },
}

function CustomToast({ variant, title, description, t }: CustomToastProps) {
  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-xl",
        "motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-md",
        "dark:bg-zinc-900/90 bg-background/95 supports-[backdrop-filter]:bg-background/60",
        style.container
      )}
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <span className="sr-only">{style.srLabel}: </span>

      <div
        className={cn("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none", style.gradient)}
        aria-hidden="true"
      />

      <div className="relative flex w-full items-start gap-4">
        <div
          className={cn("flex-shrink-0 rounded-full p-2", style.iconBg)}
        >
          <Icon
            size={18}
            className={style.iconColor}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 grid gap-1 pt-0.5">
          <h3 className={cn("font-semibold text-sm leading-none tracking-tight", style.title)}>
            {title}
          </h3>
          {description && (
            <p className={cn("text-xs leading-relaxed opacity-90", style.desc)}>
              {description}
            </p>
          )}
        </div>

        <button
          onClick={() => toast.dismiss(t)}
          className={cn(
            "flex-shrink-0 flex items-center justify-center",
            "w-8 h-8 -mr-2 -mt-2",
            "rounded-full text-muted-foreground/60",
            "hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            "transition-colors"
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

const showToast = {
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

export { Toaster, showToast }