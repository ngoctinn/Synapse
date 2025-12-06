"use client";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StripCalendar } from "@/shared/ui/custom/strip-calendar";
import { Label } from "@/shared/ui/label";
import { Calendar, Clock, User, Users } from "lucide-react";
import { BookingTechnician, TimeSlot } from "../../schemas/booking-schema";

interface DateTimeSelectionStepProps {
  selectedDate?: Date;
  selectedTimeSlot: string;
  selectedTechnicianId?: string;
  timeSlots: TimeSlot[];
  technicians: BookingTechnician[];
  onDateChange: (date: Date) => void;
  onTimeSlotChange: (time: string) => void;
  onTechnicianChange: (id: string) => void;
}

export function DateTimeSelectionStep({
  selectedDate,
  selectedTimeSlot,
  selectedTechnicianId,
  timeSlots,
  technicians,
  onDateChange,
  onTimeSlotChange,
  onTechnicianChange,
}: DateTimeSelectionStepProps) {
  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <Label className="font-medium text-foreground/80">Chọn ngày</Label>
        </div>
        <StripCalendar
          date={selectedDate}
          onDateChange={onDateChange}
          className="mx-auto"
        />
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="font-medium text-foreground/80">Chọn khung giờ</Label>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTimeSlot === slot.time ? "default" : "outline"}
              size="sm"
              disabled={!slot.available}
              onClick={() => onTimeSlotChange(slot.time)}
              className={cn(
                "h-11 min-w-[44px] text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedTimeSlot === slot.time
                  ? "shadow-md shadow-primary/20"
                  : "hover:border-primary/50",
                !slot.available && "opacity-40 cursor-not-allowed line-through"
              )}
            >
              {slot.time}
            </Button>
          ))}
        </div>

        {timeSlots.filter((s) => !s.available).length > 0 && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-3 h-0.5 bg-muted-foreground" />
            Khung giờ gạch ngang đã hết chỗ
          </p>
        )}
      </div>

      {/* Technician Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <Label className="font-medium text-foreground/80">
            Chọn kỹ thuật viên <span className="text-muted-foreground font-normal">(tùy chọn)</span>
          </Label>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Auto option */}
          <Button
            variant={!selectedTechnicianId ? "default" : "outline"}
            size="sm"
            onClick={() => onTechnicianChange("")}
            className={cn(
              "gap-2 h-11 min-w-[44px] px-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !selectedTechnicianId && "shadow-md shadow-primary/20"
            )}
          >
            <Users className="h-4 w-4" />
            Để Spa chọn
          </Button>

          {technicians.map((tech) => {
            const isSelected = selectedTechnicianId === tech.id;
            return (
              <Button
                key={tech.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onTechnicianChange(tech.id)}
                className={cn(
                  "gap-2 h-11 min-w-[44px] px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSelected && "shadow-md shadow-primary/20"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={tech.avatar_url} alt={tech.name} />
                  <AvatarFallback className="text-[10px]">
                    {tech.name.split(" ").pop()?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[100px]">{tech.name}</span>
                {tech.title && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tech.title}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
