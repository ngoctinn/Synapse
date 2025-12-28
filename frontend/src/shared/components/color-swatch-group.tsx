"use client";

import { cn } from "@/shared/lib/utils";

export interface ColorSwatchGroupProps {
  /** Current selected color value */
  value: string;
  /** Callback when color changes */
  onChange: (color: string) => void;
  /** Array of color options (hex values) */
  options: string[];
  /** Accessible label for the radio group */
  ariaLabel: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Additional className */
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  default: "w-8 h-8",
  lg: "w-10 h-10",
};

/**
 * ColorSwatchGroup - Shared component cho việc chọn màu sắc
 * Sử dụng role="radiogroup" với proper aria attributes và consistent focus/selection styles
 */
export function ColorSwatchGroup({
  value,
  onChange,
  options,
  ariaLabel,
  size = "default",
  className,
}: ColorSwatchGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((color) => {
        const isSelected = value === color;
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Màu ${color}`}
            onClick={() => onChange(color)}
            className={cn(
              // Base styles
              sizeClasses[size],
              "flex-shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200",
              // Focus styles
              "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-offset-2",
              // Selection states
              isSelected
                ? "border-foreground ring-primary scale-110 ring-[1.5px] ring-offset-1"
                : "border-transparent opacity-70 hover:scale-110 hover:opacity-100 hover:shadow-sm"
            )}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
