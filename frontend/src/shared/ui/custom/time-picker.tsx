"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/shared/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";

interface TimePickerProps {
  value?: string; // Format "HH:mm"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Parse current value (HH:mm) to 12h format
  const [period, setPeriod] = React.useState<"SA" | "CH">("SA");
  const [displayHour, setDisplayHour] = React.useState<number | null>(null);
  const [displayMinute, setDisplayMinute] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        if (h >= 12) {
          setPeriod("CH");
          setDisplayHour(h > 12 ? h - 12 : 12); // 13 -> 01, 12 -> 12
        } else {
          setPeriod("SA");
          setDisplayHour(h === 0 ? 12 : h); // 0 -> 12
        }
        setDisplayMinute(m);
      }
    }
  }, [value]);

  const hoursList = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5...

  const handleTimeChange = (type: "hour" | "minute" | "period", val: number | string) => {
    let newHour = displayHour ?? 12;
    let newMinute = displayMinute ?? 0;
    let newPeriod = period;

    if (type === "hour") newHour = val as number;
    if (type === "minute") newMinute = val as number;
    if (type === "period") newPeriod = val as "SA" | "CH";

    // Update local state for immediate UI feedback (optional, but good for UX)
    if (type === "hour") setDisplayHour(newHour);
    if (type === "minute") setDisplayMinute(newMinute);
    if (type === "period") setPeriod(newPeriod);

    // Convert back to 24h for onChange
    let finalHour = newHour;
    if (newPeriod === "CH" && newHour < 12) finalHour += 12;
    if (newPeriod === "SA" && newHour === 12) finalHour = 0;

    const formattedTime = `${finalHour.toString().padStart(2, "0")}:${newMinute
      .toString()
      .padStart(2, "0")}`;
    
    onChange(formattedTime);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <InputWithIcon
            icon={Clock}
            value={value ? `${displayHour?.toString().padStart(2, "0")}:${displayMinute?.toString().padStart(2, "0")} ${period}` : ""}
            placeholder="Chọn giờ"
            readOnly
            className={cn("cursor-pointer hover:border-primary/50", className)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border/60" align="start">
        <div className="flex h-[220px] divide-x divide-border/50">
          {/* Hours Column */}
          <ScrollArea className="w-[60px]">
             <div className="flex flex-col p-2 gap-1 items-center">
              <Label className="mb-2 text-[10px] uppercase font-bold text-muted-foreground">Giờ</Label>
              {hoursList.map((h) => (
                <Button
                  key={h}
                  variant={displayHour === h ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full h-8 rounded-lg font-medium",
                    displayHour === h ? "bg-primary text-primary-foreground" : "text-foreground/80"
                  )}
                  onClick={() => handleTimeChange("hour", h)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Minutes Column */}
          <ScrollArea className="w-[60px]">
            <div className="flex flex-col p-2 gap-1 items-center">
              <Label className="mb-2 text-[10px] uppercase font-bold text-muted-foreground">Phút</Label>
              {minutesList.map((m) => (
                <Button
                  key={m}
                  variant={displayMinute === m ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full h-8 rounded-lg font-medium",
                    displayMinute === m ? "bg-primary text-primary-foreground" : "text-foreground/80"
                  )}
                  onClick={() => handleTimeChange("minute", m)}
                >
                  {m.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Period Column (SA/CH) */}
          <ScrollArea className="w-[60px]">
            <div className="flex flex-col p-2 gap-1 items-center">
              <Label className="mb-2 text-[10px] uppercase font-bold text-muted-foreground">Buổi</Label>
              {["SA", "CH"].map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full h-8 rounded-lg font-medium",
                    period === p ? "bg-primary text-primary-foreground" : "text-foreground/80"
                  )}
                  onClick={() => handleTimeChange("period", p === "SA" ? "SA" : "CH")}
                >
                  {p}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
