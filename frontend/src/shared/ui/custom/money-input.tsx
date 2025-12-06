"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import * as React from "react";

interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number;
  onChange: (value: number) => void;
  /**
   * Variant size cho MoneyInput
   * - `default`: h-10 - kích thước mặc định
   * - `lg`: h-12 - kích thước lớn
   * - `sm`: h-9 - kích thước nhỏ gọn
   */
  variant?: "default" | "lg" | "sm";
}

const sizeVariants = {
  sm: "h-9",
  default: "h-10",
  lg: "h-12",
};

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, variant = "default", ...props }, ref) => {
    // Format helper
    const formatValue = (val: number | undefined) => {
      if (val === undefined || val === null) return "";
      return new Intl.NumberFormat("vi-VN").format(val);
    };

    const [displayValue, setDisplayValue] = React.useState(formatValue(value));

    // Sync external value change
    React.useEffect(() => {
      setDisplayValue(formatValue(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove all non-digit characters
      const rawValue = inputValue.replace(/\D/g, "");

      // Convert to number
      const numberValue = rawValue === "" ? 0 : Number(rawValue);

      // Update parent
      onChange(numberValue);

      // Update display immediately (cursor will jump to end, which is acceptable for simple numeric entry)
      setDisplayValue(formatValue(numberValue));
    };

    return (
      <div className="relative group">
        <Input
          type="text"
          inputMode="numeric"
          className={cn(
            // Base styles - Premium look
            sizeVariants[variant],
            "bg-background border-input/50 rounded-lg",
            // Text alignment and padding
            "pr-12 text-right font-mono",
            // Transitions và shadows
            "transition-all duration-200 shadow-sm",
            "hover:shadow-md hover:border-input",
            // Focus states - Softer, more elegant
            "focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          placeholder="0"
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium transition-colors duration-200 group-focus-within:text-primary">
          VNĐ
        </div>
      </div>
    );
  }
);
MoneyInput.displayName = "MoneyInput";
