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

interface TimePickerProps {
  value?: string; // Format "HH:mm"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Parse current value
  const [hours, minutes] = value ? value.split(":").map(Number) : [null, null];

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    let newHours = hours ?? 0;
    let newMinutes = minutes ?? 0;

    if (type === "hour") {
      newHours = val;
    } else {
      newMinutes = val;
    }

    const formattedTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
    
    onChange(formattedTime);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3 hover:bg-muted/50 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 opacity-50" />
          {value || "Chọn giờ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border/60" align="start">
        <div className="flex h-[220px] divide-x divide-border/50">
          <ScrollArea className="w-[80px]">
            <div className="flex flex-col p-2 gap-1">
              <Label className="mb-2 text-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider sticky top-0 bg-popover py-1 z-10">
                Giờ
              </Label>
              {hoursList.map((h) => (
                <Button
                  key={h}
                  variant={hours === h ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "justify-center h-8 rounded-lg font-medium",
                    hours === h ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80 hover:bg-muted"
                  )}
                  onClick={() => handleTimeChange("hour", h)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="w-[80px]">
            <div className="flex flex-col p-2 gap-1">
              <Label className="mb-2 text-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider sticky top-0 bg-popover py-1 z-10">
                Phút
              </Label>
              {minutesList.map((m) => (
                <Button
                  key={m}
                  variant={minutes === m ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "justify-center h-8 rounded-lg font-medium",
                    minutes === m ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80 hover:bg-muted"
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
