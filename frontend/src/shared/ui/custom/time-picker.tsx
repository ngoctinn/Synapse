"use client";

import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { ScrollArea } from "@/shared/ui/scroll-area";
import * as React from "react";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
}

// Generate lists outside component to avoid re-calculation
const hoursList = Array.from({ length: 24 }, (_, i) => i);
const minutesList = Array.from({ length: 12 }, (_, i) => i * 5); // Step 5 minutes

export function TimePicker({
  value,
  onChange,
  className,
  disabled,
  hasError,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || "09:00");

  // Sync internal state with prop value
  React.useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  // Parse HH:mm logic from internal state for instant feedback
  const [h, m] = internalValue.split(":").map(Number);
  const currentHour = isNaN(h) ? 9 : h;
  const currentMinute = isNaN(m) ? 0 : m;

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    const newHour = type === "hour" ? val : currentHour;
    const newMinute = type === "minute" ? val : currentMinute;
    const formatted = `${newHour.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}`;

    setInternalValue(formatted); // Optimistic update
    onChange?.(formatted);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "group w-full h-14 justify-between px-4 text-left font-normal border-input hover:bg-accent/50 transition-all focus-premium",
            "bg-background shadow-xs text-sm",
            "data-[state=open]:border-primary/80 data-[state=open]:ring-[1.5px] data-[state=open]:ring-primary/20",
            hasError && "border-destructive text-destructive focus-visible:ring-destructive/20",
            className
          )}
        >
          <span className={cn(
            "flex-1 text-left tabular-nums truncate",
            !value && "text-muted-foreground/60 font-normal",
            value && "text-foreground font-medium"
          )}>
            {value || "Chọn giờ (24h)"}
          </span>
          <ChevronDownIcon className="size-5 opacity-50 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0 border-none shadow-premium-lg bg-card/95 backdrop-blur-md" align="start">
          <div className="flex h-[280px] divide-x divide-border/20">
            {/* Hours Column */}
            <ScrollArea className="h-full w-[64px]">
              <div className="flex flex-col gap-0.5 p-1">
                {hoursList.map((hr) => (
                  <Button
                    key={hr}
                    variant="ghost"
                    className={cn(
                      "w-full h-8 rounded-md py-0 font-medium tabular-nums transition-all",
                      currentHour === hr
                        ? "bg-primary text-primary-foreground shadow-premium-sm hover:bg-primary hover:text-primary-foreground"
                        : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                    )}
                    onClick={() => handleTimeChange("hour", hr)}
                  >
                    {hr.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Minutes Column */}
            <ScrollArea className="h-full w-[64px]">
              <div className="flex flex-col gap-0.5 p-1">
                {minutesList.map((min) => (
                  <Button
                    key={min}
                    variant="ghost"
                    className={cn(
                      "w-full h-8 rounded-md py-0 font-medium tabular-nums transition-all",
                      currentMinute === min
                        ? "bg-primary text-primary-foreground shadow-premium-sm hover:bg-primary hover:text-primary-foreground"
                        : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                    )}
                    onClick={() => handleTimeChange("minute", min)}
                  >
                    {min.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
