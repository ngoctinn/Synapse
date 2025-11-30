"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import * as React from "react";

interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number;
  onChange: (value: number) => void;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
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
      <div className="relative">
        <Input
          type="text"
          inputMode="numeric"
          className={cn("pr-12 text-right font-mono", className)}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          placeholder="0"
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
          VNĐ
        </div>
      </div>
    );
  }
);
MoneyInput.displayName = "MoneyInput";
