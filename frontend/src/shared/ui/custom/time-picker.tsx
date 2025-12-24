"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Clock } from "lucide-react";
import * as React from "react";

interface TimePickerProps {
  value?: string; // Định dạng "HH:mm"
  onChange: (value: string) => void;
  className?: string;
  hasError?: boolean;
}

export function TimePicker({
  value,
  onChange,
  className,
  hasError,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayHour, setDisplayHour] = React.useState<number | null>(null);
  const [displayMinute, setDisplayMinute] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setDisplayHour(h);
        setDisplayMinute(m);
      }
    }
  }, [value]);

  const hoursList = Array.from({ length: 24 }, (_, i) => i); // 0-23
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5...

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    let newHour = displayHour ?? 9; // Default to 09:00 if not set
    let newMinute = displayMinute ?? 0;

    if (type === "hour") newHour = val;
    if (type === "minute") newMinute = val;

    // Cập nhật state cục bộ
    setDisplayHour(newHour);
    setDisplayMinute(newMinute);

    // Format HH:mm
    const formattedTime = `${newHour.toString().padStart(2, "0")}:${newMinute
      .toString()
      .padStart(2, "0")}`;

    onChange(formattedTime);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="group cursor-pointer">
          <Input
            startContent={
              <Clock
                className={cn(
                  "h-4 w-4 transition-colors",
                  hasError
                    ? "text-destructive/70"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
            }
            value={value || ""}
            placeholder="--:--"
            readOnly
            className={cn(
              "cursor-pointer font-medium transition-all duration-200",
              "hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:ring-1",
              hasError &&
                "border-destructive/50 hover:border-destructive text-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="border-border/60 w-auto rounded-lg p-0 shadow-xl"
        align="start"
      >
        <div className="divide-border/50 flex h-[280px] divide-x">
          {/* Cột Giờ (24h) */}
          <ScrollArea className="h-full w-[70px]">
            <div className="flex flex-col items-center gap-1 p-2">
              <Label className="text-muted-foreground mb-2 text-[10px] font-bold uppercase">
                Giờ
              </Label>
              {hoursList.map((h) => (
                <Button
                  key={h}
                  variant={displayHour === h ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full font-medium tabular-nums",
                    displayHour === h
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                  onClick={() => handleTimeChange("hour", h)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Cột Phút */}
          <ScrollArea className="h-full w-[70px]">
            <div className="flex flex-col items-center gap-1 p-2">
              <Label className="text-muted-foreground mb-2 text-[10px] font-bold uppercase">
                Phút
              </Label>
              {minutesList.map((m) => (
                <Button
                  key={m}
                  variant={displayMinute === m ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full font-medium tabular-nums",
                    displayMinute === m
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                  onClick={() => handleTimeChange("minute", m)}
                >
                  {m.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
