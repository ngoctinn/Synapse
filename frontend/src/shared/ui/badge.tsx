import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { BADGE_PRESETS, type BadgePreset } from "./badge-presets";

// ============================================
// BADGE VARIANTS - Visual Clarity Design System
// ============================================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        // === CORE VARIANTS ===
        default:
          "border-primary bg-primary/80 text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground border-border",
        outline: "text-foreground border-border bg-transparent hover:bg-accent",

        // === SEMANTIC STATUS ===
        success:
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-500",
        warning:
          "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-500",
        destructive:
          "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-500",
        info: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-500",

        // === SOFT VARIANT ===
        soft: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30",

        // === COLORS ===
        violet:
          "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/20 dark:border-violet-500/30 dark:text-violet-500",
        indigo:
          "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-500",
        emerald:
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-500",
        red: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-500",
        amber:
          "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-500",
        gray: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:border-slate-500/30 dark:text-slate-400",
        glass: "bg-white/10 backdrop-blur-md text-white border-white/20",

        // === SPECIFIC STATUS ===
        "status-active":
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-500",
        "status-inactive": "bg-muted text-muted-foreground border-border",
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

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
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
    if (finalVariant === "status-active") return "bg-emerald-500";
    if (finalVariant === "warning") return "bg-amber-500";
    if (finalVariant === "destructive") return "bg-destructive";
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
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                getIndicatorColorClass()
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              getIndicatorColorClass()
            )}
          />
        </span>
      )}
      {finalChildren}
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgePreset, BadgeVariant };

