"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import {
  Button,
  Group,
  Input,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";

import { cn } from "@/shared/lib/utils";

interface NumberInputProps
  extends Omit<NumberFieldProps, "onChange" | "value" | "className"> {
  onChange?: (value: number) => void;
  value?: number;
  suffix?: string;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      suffix,
      placeholder,
      min = 0,
      max,
      step = 1,
      formatOptions,
      ...props
    },
    ref
  ) => {
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (document.activeElement === e.currentTarget) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -step : step;
        const currentVal = value ?? 0;
        const nextVal = Math.min(
          max ?? Number.MAX_SAFE_INTEGER,
          Math.max(min, currentVal + delta)
        );
        onChange?.(nextVal);
      }
    };

    return (
      <NumberField
        ref={ref}
        value={value}
        onChange={onChange}
        minValue={min}
        maxValue={max}
        step={step}
        formatOptions={{
          style: "decimal",
          useGrouping: true,
          maximumFractionDigits: 0,
          ...formatOptions,
        }}
        className={cn("w-full", className)}
        {...props}
      >
        <Group className="group-data-[invalid=true]:border-destructive/80 group-data-[invalid=true]:ring-destructive/10 group-data-[invalid=true]:focus-within:ring-destructive/50 group-data-[invalid=true]:focus-within:border-destructive focus-within:ring-ring/40 focus-within:border-primary/50 border-input bg-background dark:bg-input/30 hover:border-primary/30 relative inline-flex h-14 w-full items-center overflow-hidden rounded-lg border text-sm shadow-xs transition-with-all duration-200 focus-within:outline-none focus-within:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50">
          <Input
            className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed tabular-nums"
            placeholder={placeholder}
            onWheel={handleWheel}
          />
          {suffix && (
            <div className="mr-2 text-sm text-muted-foreground select-none">
              {suffix}
            </div>
          )}
          <div className="flex h-full flex-col border-l border-border">
            <Button
              slot="increment"
              className="hover:bg-accent hover:text-foreground flex h-1/2 w-6 flex-1 items-center justify-center border-b border-border bg-transparent text-muted-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronUp className="size-3" />
            </Button>
            <Button
              slot="decrement"
              className="hover:bg-accent hover:text-foreground flex h-1/2 w-6 flex-1 items-center justify-center bg-transparent text-muted-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDown className="size-3" />
            </Button>
          </div>
        </Group>
      </NumberField>
    );
  }
);
NumberInput.displayName = "NumberInput";
