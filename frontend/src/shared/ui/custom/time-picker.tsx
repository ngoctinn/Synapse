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
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Chọn giờ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-[200px] divide-x">
          <ScrollArea className="w-[70px]">
            <div className="flex flex-col p-2">
              <Label className="mb-2 text-center text-xs font-semibold text-muted-foreground">
                Giờ
              </Label>
              {hoursList.map((h) => (
                <Button
                  key={h}
                  variant={hours === h ? "default" : "ghost"}
                  size="sm"
                  className="justify-center"
                  onClick={() => handleTimeChange("hour", h)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="w-[70px]">
            <div className="flex flex-col p-2">
              <Label className="mb-2 text-center text-xs font-semibold text-muted-foreground">
                Phút
              </Label>
              {minutesList.map((m) => (
                <Button
                  key={m}
                  variant={minutes === m ? "default" : "ghost"}
                  size="sm"
                  className="justify-center"
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
