"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import {
  Button,
  Group,
  I18nProvider,
  Input,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";

import { cn } from "@/shared/lib/utils";

interface NumberInputProps extends Omit<
  NumberFieldProps,
  "onChange" | "value" | "className"
> {
  onChange?: (value: number) => void;
  value?: number;
  suffix?: string;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  variant?: "default" | "currency";
  "aria-invalid"?: boolean | "true" | "false";
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
      step,
      formatOptions,
      ...props
    },
    ref
  ) => {
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (document.activeElement === e.currentTarget) {
        e.preventDefault();
        const wheelStep = step ?? 1;
        const delta = e.deltaY > 0 ? -wheelStep : wheelStep;
        const currentVal = value ?? 0;
        const nextVal = Math.min(
          max ?? Number.MAX_SAFE_INTEGER,
          Math.max(min, currentVal + delta)
        );
        onChange?.(nextVal);
      }
    };
    const isCurrency = props.variant === "currency";
    const effectiveStep = step ?? (isCurrency ? 1000 : 1);

    const isInvalid =
      props.isInvalid ||
      props["aria-invalid"] === true ||
      props["aria-invalid"] === "true";

    return (
      <I18nProvider locale="en-US">
        <NumberField
          ref={ref}
          value={value}
          onChange={onChange}
          minValue={min}
          maxValue={max}
          step={effectiveStep}
          isInvalid={isInvalid}
          formatOptions={{
            style: "decimal",
            useGrouping: true,
            maximumFractionDigits: isCurrency ? 0 : 2,
            ...formatOptions,
          }}
          className={cn("group w-full", className)}
          {...props}
        >
          <Group className="group-data-[invalid=true]:border-destructive/80 group-data-[invalid=true]:ring-destructive/10 group-data-[invalid=true]:focus-within:ring-destructive/50 group-data-[invalid=true]:focus-within:border-destructive focus-within:ring-ring/40 focus-within:border-primary/50 border-input bg-background dark:bg-input/30 hover:border-primary/30 shadow-xs transition-with-all relative flex h-10 w-full items-center overflow-hidden rounded-lg border text-base duration-200 focus-within:outline-none focus-within:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
            <Input
              className="placeholder:text-muted-foreground h-full flex-1 bg-transparent px-3 py-2 tabular-nums shadow-none outline-none focus-visible:ring-0 disabled:cursor-not-allowed"
              placeholder={placeholder}
              onWheel={handleWheel}
            />
            {suffix && (
              <div className="text-muted-foreground pointer-events-none mr-3 select-none text-sm">
                {suffix}
              </div>
            )}
            {!isCurrency && (
              <div className="border-border flex h-full w-6 shrink-0 flex-col border-l">
                <Button
                  slot="increment"
                  className="hover:bg-accent hover:text-foreground border-border text-muted-foreground flex flex-1 items-center justify-center border-b bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronUp className="size-3" />
                </Button>
                <Button
                  slot="decrement"
                  className="hover:bg-accent hover:text-foreground text-muted-foreground flex flex-1 items-center justify-center bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronDown className="size-3" />
                </Button>
              </div>
            )}
          </Group>
        </NumberField>
      </I18nProvider>
    );
  }
);
NumberInput.displayName = "NumberInput";
