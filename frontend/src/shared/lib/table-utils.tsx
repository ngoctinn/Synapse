import { useEffect, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "./utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Hook for table keyboard navigation
 * Handles: Arrow keys, Enter, Escape
 *
 * @example
 * const keyboard = useTableKeyboard({
 *   onRowSelect: (index) => setSelectedRow(index),
 *   onRowActivate: (index) => openDetails(data[index]),
 *   rowCount: data.length,
 * });
 */
interface UseTableKeyboardOptions {
  /** Total số rows trong table */
  rowCount: number;
  /** Callback khi user navigate đến row mới */
  onRowSelect?: (index: number) => void;
  /** Callback khi user activate row (Enter key) */
  onEnter?: (index: number) => void;
  /** Callback khi user press Escape */
  onEscape?: () => void;
  /** Initial selected row index */
  initialIndex?: number;
  /** Disable keyboard navigation */
  disabled?: boolean;
}

export function useTableKeyboard({
  rowCount,
  onRowSelect,
  onEnter,
  onEscape,
  initialIndex = 0,
  disabled = false,
}: UseTableKeyboardOptions) {
  const currentIndex = initialIndex;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || rowCount === 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, rowCount - 1);
          onRowSelect?.(nextIndex);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          onRowSelect?.(prevIndex);
          break;
        }
        case "Enter": {
          e.preventDefault();
          onEnter?.(currentIndex);
          break;
        }
        case "Escape": {
          e.preventDefault();
          onEscape?.();
          break;
        }
      }
    },
    [currentIndex, rowCount, onRowSelect, onEnter, onEscape, disabled]
  );

  useEffect(() => {
    if (disabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, disabled]);

  return {
    currentIndex,
    handleKeyDown,
  };
}

/**
 * Component để hiển thị truncated text với tooltip
 * Fix Issue #13: Text Truncation với Tooltip Fallback
 *
 * @example
 * <TruncatedCell maxWidth={200}>
 *   {customer.medical_notes}
 * </TruncatedCell>
 */
interface TruncatedCellProps {
  children: React.ReactNode;
  /** Max width in pixels, default 200 */
  maxWidth?: number;
  /** Custom className */
  className?: string;
  /** Tooltip delay in ms */
  tooltipDelay?: number;
}

export function TruncatedCell({
  children,
  maxWidth = 200,
  className,
  tooltipDelay = 300,
}: TruncatedCellProps) {
  const content = String(children || "");
  const shouldTruncate = content.length > 50; // Rough estimate

  if (!shouldTruncate) {
    return <span className={className}>{children}</span>;
  }

  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-block truncate",
              className
            )}
            style={{ maxWidth: `${maxWidth}px` }}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="whitespace-pre-wrap">{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


/**
 * Format date cho table display
 * Fix Issue #34: Date Formatting Centralized
 *
 * @example
 * formatTableDate(new Date(), 'short') // "24/12/2024"
 * formatTableDate(new Date(), 'long')  // "24/12/2024 20:30"
 * formatTableDate(new Date(), 'time')  // "20:30"
 */
export function formatTableDate(
  date: Date | string | null | undefined,
  formatType: "short" | "long" | "time" | "custom" = "short",
  customFormat?: string
): string {
  if (!date) return "--";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (formatType === "custom" && customFormat) {
    return format(dateObj, customFormat, { locale: vi });
  }

  const formats: Record<"short" | "long" | "time", string> = {
    short: "dd/MM/yyyy",
    long: "dd/MM/yyyy HH:mm",
    time: "HH:mm",
  };

  return format(dateObj, formats[formatType as "short" | "long" | "time"], { locale: vi });
}

/**
 * Generate contrast-safe color cho avatar fallbacks
 * Fix Issue #24: Avatar Fallback Colors Accessibility
 *
 * Ensures WCAG AA contrast ratio (4.5:1 for normal text)
 */
export function getAccessibleAvatarColor(seed: string): {
  bg: string;
  text: string;
} {
  // Generate hue from string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;

  // Use oklch for better perceptual uniformity
  // Lightness: 65% cho background (medium)
  // Chroma: 0.15 (moderate saturation)
  const bg = `oklch(65% 0.15 ${hue})`;

  // Text: 25% lightness cho high contrast
  const text = `oklch(25% 0.08 ${hue})`;

  return { bg, text };
}

/**
 * Calculate ideal text color (black/white) cho background color
 * Sử dụng relative luminance formula
 */
export function getContrastTextColor(hexColor: string): "white" | "black" {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}
