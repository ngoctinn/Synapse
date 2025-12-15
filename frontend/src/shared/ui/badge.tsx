import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

// ============================================
// BADGE VARIANTS - Visual Clarity Design System
// ============================================
// Quy tắc màu mới:
// - Background: Solid color (100 shade) - rõ ràng
// - Text: Đậm (700 shade) - dễ đọc
// - Border: Cùng tone (200 shade) - định hình rõ
// - Dark mode: Inverted (950 bg, 300 text, 800 border)
// ============================================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        // === CORE VARIANTS ===
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-border",
        outline:
          "text-foreground border-border bg-transparent hover:bg-accent",

        // === SEMANTIC STATUS (Clear & Distinct) ===
        success:
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        warning:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        destructive:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        info:
          "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",

        // === COLOR PALETTE (17 distinct colors for tags/categories) ===
        rose:
          "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        pink:
          "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
        fuchsia:
          "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800",
        purple:
          "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        violet:
          "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
        indigo:
          "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
        blue:
          "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        sky:
          "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
        cyan:
          "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
        teal:
          "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
        emerald:
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        green:
          "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        lime:
          "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
        yellow:
          "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
        amber:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        orange:
          "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
        red:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        gray:
          "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",

        // === SPECIAL TIER VARIANTS (Kept for backwards compatibility) ===
        gold:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        platinum:
          "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",

        // === STATUS VARIANTS (Kept for backwards compatibility) ===
        "status-active":
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        "status-inactive":
          "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",

        // === SOFT VARIANT (Primary tone - lighter) ===
        soft:
          "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30",

        // === VISUAL EFFECTS ===
        glass:
          "border-white/20 bg-white/80 text-foreground backdrop-blur-md shadow-sm dark:bg-black/40 dark:text-white dark:border-white/10",
      },
      size: {
        xs: "text-[10px] px-2 py-0.5 h-5 [&>svg]:size-3",
        sm: "text-[11px] px-2.5 py-0.5 h-6 [&>svg]:size-3",
        md: "text-xs px-3 py-1 h-7 [&>svg]:size-3.5",
        lg: "text-sm px-4 py-1.5 h-8 [&>svg]:size-4",
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
  // Resource Types
  | "resource-room"
  | "resource-equipment"
  // Invoice Status
  | "invoice-unpaid"
  | "invoice-paid"
  | "invoice-refunded"
  // Exception Types
  | "exception-holiday"
  | "exception-maintenance"
  | "exception-special"
  | "exception-custom"
  // Channel Status
  | "channel-connected"
  | "channel-disconnected"
  // Generic
  | "tag"
  | "count"
  | "new"
  | "skill"

type PresetConfig = {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>
  size?: VariantProps<typeof badgeVariants>["size"]
  label?: string
  withIndicator?: boolean
  indicatorPulse?: boolean
}

const BADGE_PRESETS: Record<BadgePreset, PresetConfig> = {
  // === APPOINTMENT STATUS ===
  "appointment-pending": { variant: "amber", label: "Chờ xác nhận" },
  "appointment-confirmed": { variant: "blue", label: "Đã xác nhận" },
  "appointment-in-progress": { variant: "violet", label: "Đang thực hiện", withIndicator: true, indicatorPulse: true },
  "appointment-completed": { variant: "emerald", label: "Hoàn thành" },
  "appointment-cancelled": { variant: "red", label: "Đã hủy" },
  "appointment-no-show": { variant: "gray", label: "Không đến" },

  // === ROLES ===
  "role-admin": { variant: "purple", label: "Quản trị viên" },
  "role-receptionist": { variant: "sky", label: "Lễ tân" },
  "role-technician": { variant: "cyan", label: "Kỹ thuật viên" },
  "role-customer": { variant: "gray", label: "Khách hàng" },

  // === TIERS ===
  "tier-silver": { variant: "gray", label: "Silver" },
  "tier-gold": { variant: "amber", label: "Gold" },
  "tier-platinum": { variant: "violet", label: "Platinum" },

  // === RESOURCE STATUS ===
  "resource-available": { variant: "emerald", label: "Sẵn sàng", withIndicator: true },
  "resource-in-use": { variant: "orange", label: "Đang sử dụng" },
  "resource-maintenance": { variant: "red", label: "Bảo trì" },

  // === RESOURCE TYPE ===
  "resource-room": { variant: "blue", size: "sm", label: "Phòng" },
  "resource-equipment": { variant: "teal", size: "sm", label: "Thiết bị" },

  // === INVOICE ===
  "invoice-unpaid": { variant: "amber", label: "Chưa thanh toán" },
  "invoice-paid": { variant: "emerald", label: "Đã thanh toán" },
  "invoice-refunded": { variant: "red", label: "Đã hoàn tiền" },

  // === EXCEPTION TYPES ===
  "exception-holiday": { variant: "red", size: "xs", label: "Nghỉ lễ" },
  "exception-maintenance": { variant: "gray", size: "xs", label: "Bảo trì" },
  "exception-special": { variant: "violet", size: "xs", label: "Giờ đặc biệt" },
  "exception-custom": { variant: "outline", size: "xs", label: "Tùy chỉnh" },

  // === CHANNEL STATUS ===
  "channel-connected": { variant: "emerald", label: "Đã kết nối" },
  "channel-disconnected": { variant: "gray", label: "Chưa kết nối" },

  // === GENERIC ===
  "tag": { variant: "blue", size: "sm" },
  "count": { variant: "violet", size: "xs" },
  "new": { variant: "emerald", label: "Mới", size: "sm" },
  "skill": { variant: "cyan", size: "sm" },
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
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        destructive: "bg-red-500",
        muted: "bg-muted-foreground/40",
      }
      return colorMap[indicatorColor]
    }
    // Map variant to indicator color
    if (finalVariant === "success" || finalVariant === "emerald" || finalVariant === "green" || finalVariant === "status-active") return "bg-emerald-500"
    if (finalVariant === "warning" || finalVariant === "amber" || finalVariant === "yellow" || finalVariant === "orange") return "bg-amber-500"
    if (finalVariant === "destructive" || finalVariant === "red" || finalVariant === "rose") return "bg-red-500"
    if (finalVariant === "info" || finalVariant === "blue" || finalVariant === "sky" || finalVariant === "cyan") return "bg-blue-500"
    if (finalVariant === "violet" || finalVariant === "purple" || finalVariant === "indigo" || finalVariant === "fuchsia") return "bg-violet-500"
    if (finalVariant === "status-inactive" || finalVariant === "gray") return "bg-gray-400"
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

