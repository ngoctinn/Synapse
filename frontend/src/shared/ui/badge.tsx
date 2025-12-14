import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

// ============================================
// BADGE VARIANTS - Chuẩn hóa màu sắc nhất quán
// ============================================
// Quy tắc màu:
// - Background: 15% opacity (bg-xxx/15)
// - Text: Màu đậm (text-xxx)
// - Hover: 25% opacity (hover:bg-xxx/25)
// ============================================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        // === CORE VARIANTS ===
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/25",
        outline:
          "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",

        // === SEMANTIC VARIANTS (Nhất quán 15% bg, 25% hover) ===
        success:
          "border-transparent bg-success/15 text-success hover:bg-success/25",
        warning:
          "border-transparent bg-warning/15 text-warning hover:bg-warning/25",
        info:
          "border-transparent bg-info/15 text-info hover:bg-info/25",

        // === SOFT VARIANT (Primary tone) ===
        soft:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",

        // === ROLE VARIANTS (Dùng CSS custom properties) ===
        purple:
          "border-transparent bg-[oklch(0.85_0.08_300)] text-[oklch(0.45_0.15_300)] dark:bg-[oklch(0.30_0.08_300)] dark:text-[oklch(0.80_0.12_300)] hover:opacity-80",
        indigo:
          "border-transparent bg-[oklch(0.85_0.08_270)] text-[oklch(0.45_0.15_270)] dark:bg-[oklch(0.30_0.08_270)] dark:text-[oklch(0.80_0.12_270)] hover:opacity-80",

        // === TIER VARIANTS ===
        gold:
          "border-transparent bg-[oklch(0.92_0.10_85)] text-[oklch(0.45_0.12_60)] dark:bg-[oklch(0.30_0.10_85)] dark:text-[oklch(0.85_0.12_85)] hover:opacity-80",
        platinum:
          "border-transparent bg-[oklch(0.92_0.03_260)] text-[oklch(0.40_0.02_260)] dark:bg-[oklch(0.30_0.03_260)] dark:text-[oklch(0.85_0.02_260)] hover:opacity-80",

        // === STATUS VARIANTS ===
        "status-active":
          "border-transparent bg-success/15 text-success",
        "status-inactive":
          "border-transparent bg-muted text-muted-foreground",

        // === VISUAL EFFECTS ===
        glass:
          "border-white/20 bg-black/40 text-white backdrop-blur-md shadow-sm",
        "glass-light":
          "border-white/40 bg-white/30 text-foreground backdrop-blur-md shadow-sm dark:bg-black/30 dark:border-white/10 dark:text-white",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0 h-4",
        sm: "text-[11px] px-2 py-0.5 h-5",
        md: "text-xs px-2.5 py-0.5 h-6",
        lg: "text-sm px-3 py-1 h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ============================================
// PRESET SYSTEM - Sử dụng preset để đơn giản hóa
// ============================================

export type BadgePreset =
  // Appointment Status
  | "appointment-pending"
  | "appointment-confirmed"
  | "appointment-in-progress"
  | "appointment-completed"
  | "appointment-cancelled"
  | "appointment-no-show"
  // Staff Roles
  | "role-admin"
  | "role-receptionist"
  | "role-technician"
  | "role-customer"
  // Customer Tiers
  | "tier-silver"
  | "tier-gold"
  | "tier-platinum"
  // Resource Status
  | "resource-available"
  | "resource-in-use"
  | "resource-maintenance"
  // Invoice Status
  | "invoice-unpaid"
  | "invoice-paid"
  | "invoice-refunded"
  // Generic
  | "tag"
  | "count"
  | "new"

type PresetConfig = {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>
  size?: VariantProps<typeof badgeVariants>["size"]
  label?: string
  withIndicator?: boolean
  indicatorPulse?: boolean
}

const BADGE_PRESETS: Record<BadgePreset, PresetConfig> = {
  // === APPOINTMENT STATUS ===
  "appointment-pending": { variant: "warning", label: "Chờ xác nhận" },
  "appointment-confirmed": { variant: "info", label: "Đã xác nhận" },
  "appointment-in-progress": { variant: "default", label: "Đang thực hiện", withIndicator: true, indicatorPulse: true },
  "appointment-completed": { variant: "success", label: "Hoàn thành" },
  "appointment-cancelled": { variant: "destructive", label: "Đã hủy" },
  "appointment-no-show": { variant: "secondary", label: "Không đến" },

  // === ROLES ===
  "role-admin": { variant: "purple", label: "Quản trị viên" },
  "role-receptionist": { variant: "info", label: "Lễ tân" },
  "role-technician": { variant: "warning", label: "Kỹ thuật viên" },
  "role-customer": { variant: "secondary", label: "Khách hàng" },

  // === TIERS ===
  "tier-silver": { variant: "secondary", label: "Silver" },
  "tier-gold": { variant: "gold", label: "Gold" },
  "tier-platinum": { variant: "platinum", label: "Platinum" },

  // === RESOURCE ===
  "resource-available": { variant: "success", label: "Sẵn sàng", withIndicator: true },
  "resource-in-use": { variant: "warning", label: "Đang sử dụng" },
  "resource-maintenance": { variant: "destructive", label: "Bảo trì" },

  // === INVOICE ===
  "invoice-unpaid": { variant: "warning", label: "Chưa thanh toán" },
  "invoice-paid": { variant: "success", label: "Đã thanh toán" },
  "invoice-refunded": { variant: "destructive", label: "Đã hoàn tiền" },

  // === GENERIC ===
  "tag": { variant: "secondary", size: "sm" },
  "count": { variant: "info", size: "xs" },
  "new": { variant: "success", label: "Mới", size: "sm" },
}

// ============================================
// BADGE COMPONENT
// ============================================

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  asChild?: boolean
  /** Sử dụng preset có sẵn */
  preset?: BadgePreset
  /** Hiển thị indicator dot */
  withIndicator?: boolean
  /** Animation pulse cho indicator */
  indicatorPulse?: boolean
  /** Màu indicator */
  indicatorColor?: "primary" | "success" | "warning" | "destructive" | "muted"
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  preset,
  withIndicator = false,
  indicatorPulse = false,
  indicatorColor,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  // Lấy config từ preset nếu có
  const presetConfig = preset ? BADGE_PRESETS[preset] : null

  // Merge props với preset config (props có ưu tiên cao hơn)
  const finalVariant = variant ?? presetConfig?.variant ?? "default"
  const finalSize = size ?? presetConfig?.size ?? "md"
  const finalWithIndicator = withIndicator || presetConfig?.withIndicator || false
  const finalIndicatorPulse = indicatorPulse || presetConfig?.indicatorPulse || false
  const finalChildren = children ?? presetConfig?.label

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
    if (finalVariant === "success" || finalVariant === "status-active") return "bg-success"
    if (finalVariant === "warning") return "bg-warning"
    if (finalVariant === "destructive") return "bg-destructive"
    if (finalVariant === "info") return "bg-info"
    if (finalVariant === "status-inactive") return "bg-muted-foreground/40"
    return "bg-current"
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant: finalVariant, size: finalSize }), className)}
      {...props}
    >
      {finalWithIndicator && (
        <span className="relative flex h-2 w-2 shrink-0">
          {finalIndicatorPulse && (
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", getIndicatorColorClass())} />
          )}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", getIndicatorColorClass())} />
        </span>
      )}
      {finalChildren}
    </Comp>
  )
}

export { Badge, BADGE_PRESETS, badgeVariants }

