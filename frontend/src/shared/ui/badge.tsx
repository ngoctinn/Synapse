import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

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
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground border-border",
        outline: "text-foreground border-border bg-transparent hover:bg-accent",

        // === SEMANTIC STATUS ===
        success:
          "bg-alert-success text-alert-success-foreground border-alert-success-border",
        warning:
          "bg-alert-warning text-alert-warning-foreground border-alert-warning-border",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30",
        info: "bg-alert-info text-alert-info-foreground border-alert-info-border",

        // === SOFT VARIANT ===
        soft: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30",
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
);

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
  | "skill";

type PresetConfig = {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
  size?: VariantProps<typeof badgeVariants>["size"];
  label?: string;
  withIndicator?: boolean;
  indicatorPulse?: boolean;
};

const BADGE_PRESETS: Record<BadgePreset, PresetConfig> = {
  // === APPOINTMENT STATUS ===
  "appointment-pending": { variant: "warning", label: "Chờ xác nhận" },
  "appointment-confirmed": { variant: "info", label: "Đã xác nhận" },
  "appointment-in-progress": {
    variant: "secondary",
    label: "Đang thực hiện",
    withIndicator: true,
    indicatorPulse: true,
  },
  "appointment-completed": { variant: "success", label: "Hoàn thành" },
  "appointment-cancelled": { variant: "destructive", label: "Đã hủy" },
  "appointment-no-show": { variant: "outline", label: "Không đến" },

  // === ROLES ===
  "role-admin": { variant: "secondary", label: "Quản trị viên" },
  "role-receptionist": { variant: "info", label: "Lễ tân" },
  "role-technician": { variant: "info", label: "Kỹ thuật viên" },
  "role-customer": { variant: "outline", label: "Khách hàng" },

  // === TIERS ===
  "tier-silver": { variant: "outline", label: "Silver" },
  "tier-gold": { variant: "warning", label: "Gold" },
  "tier-platinum": { variant: "secondary", label: "Platinum" },

  // === RESOURCE STATUS ===
  "resource-available": {
    variant: "success",
    label: "Sẵn sàng",
    withIndicator: true,
  },
  "resource-in-use": { variant: "warning", label: "Đang sử dụng" },
  "resource-maintenance": { variant: "destructive", label: "Bảo trì" },

  // === RESOURCE TYPE ===
  "resource-room": { variant: "info", size: "sm", label: "Phòng" },
  "resource-equipment": { variant: "secondary", size: "sm", label: "Thiết bị" },

  // === INVOICE ===
  "invoice-unpaid": { variant: "warning", label: "Chưa thanh toán" },
  "invoice-paid": { variant: "success", label: "Đã thanh toán" },
  "invoice-refunded": { variant: "destructive", label: "Đã hoàn tiền" },

  // === EXCEPTION TYPES ===
  "exception-holiday": { variant: "destructive", size: "xs", label: "Nghỉ lễ" },
  "exception-maintenance": { variant: "outline", size: "xs", label: "Bảo trì" },
  "exception-special": { variant: "secondary", size: "xs", label: "Giờ đặc biệt" },
  "exception-custom": { variant: "outline", size: "xs", label: "Tùy chỉnh" },

  // === CHANNEL STATUS ===
  "channel-connected": { variant: "success", label: "Đã kết nối" },
  "channel-disconnected": { variant: "outline", label: "Chưa kết nối" },

  // === GENERIC ===
  tag: { variant: "info", size: "sm" },
  count: { variant: "secondary", size: "xs" },
  new: { variant: "success", label: "Mới", size: "sm" },
  skill: { variant: "info", size: "sm" },
};

// ============================================
// BADGE COMPONENT
// ============================================

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Sử dụng preset có sẵn */
  preset?: BadgePreset;
  /** Hiển thị indicator dot */
  withIndicator?: boolean;
  /** Animation pulse cho indicator */
  indicatorPulse?: boolean;
  /** Màu indicator */
  indicatorColor?: "primary" | "success" | "warning" | "destructive" | "muted";
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
  const Comp = asChild ? Slot : "span";

  // Lấy config từ preset nếu có
  const presetConfig = preset ? BADGE_PRESETS[preset] : null;

  // Merge props với preset config (props có ưu tiên cao hơn)
  const finalVariant = variant ?? presetConfig?.variant ?? "default";
  const finalSize = size ?? presetConfig?.size ?? "md";
  const finalWithIndicator =
    withIndicator || presetConfig?.withIndicator || false;
  const finalIndicatorPulse =
    indicatorPulse || presetConfig?.indicatorPulse || false;
  const finalChildren = children ?? presetConfig?.label;

  const getIndicatorColorClass = () => {
    if (indicatorColor) {
      const colorMap = {
        primary: "bg-primary",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        destructive: "bg-red-500",
        muted: "bg-muted-foreground/40",
      };
      return colorMap[indicatorColor];
    }
    // Map variant to indicator color
    if (finalVariant === "success") return "bg-emerald-500";
    if (finalVariant === "warning") return "bg-amber-500";
    if (finalVariant === "destructive") return "bg-red-500";
    if (finalVariant === "info") return "bg-blue-500";
    if (finalVariant === "secondary") return "bg-primary";
    return "bg-current";
  };

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: finalVariant, size: finalSize }),
        className
      )}
      {...props}
    >
      {finalWithIndicator && (
        <span className="relative flex h-2 w-2 shrink-0">
          {finalIndicatorPulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                getIndicatorColorClass()
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              getIndicatorColorClass()
            )}
          />
        </span>
      )}
      {finalChildren}
    </Comp>
  );
}

export { Badge, BADGE_PRESETS, badgeVariants };
