"use client";

import { format, parse } from "date-fns";
import { CalendarOff } from "lucide-react";
import React from "react";
import { TimeSlot } from "../../types";
import { SlotButton } from "./slot-button";

const timeOfDayGroups = [
  { label: "Sáng (6:00 - 12:00)", startHour: 6, endHour: 12 },
  { label: "Chiều (12:00 - 18:00)", startHour: 12, endHour: 18 },
  { label: "Tối (18:00 - 23:00)", startHour: 18, endHour: 23 },
];

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <CalendarOff className="text-muted-foreground size-8" />
    </div>
    <h4 className="text-lg font-medium">Không có khung giờ trống</h4>
    <p className="text-muted-foreground mx-auto mt-2 max-w-[250px] text-sm">
      Rất tiếc, hiện tại không còn khung giờ nào khả dụng. Vui lòng chọn một ngày
      khác.
    </p>
  </div>
);

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  timeSlots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}) => {
  const groupedSlots = React.useMemo(() => {
    const groups: Record<string, TimeSlot[]> = {};
    timeOfDayGroups.forEach((group) => (groups[group.label] = []));

    timeSlots.forEach((slot) => {
      const slotDateTime = parse(
        `${slot.date} ${slot.start_time}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const hour = slotDateTime.getHours();

      for (const group of timeOfDayGroups) {
        if (hour >= group.startHour && hour < group.endHour) {
          groups[group.label].push(slot);
          break;
        }
      }
    });

    return groups;
  }, [timeSlots]);

  const hasAnySlots = timeSlots.length > 0;

  if (!hasAnySlots && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {timeOfDayGroups.map((group) => {
        const slotsInGroup = groupedSlots[group.label];
        if (slotsInGroup && slotsInGroup.length === 0 && !isLoading) {
          return null;
        }
        return (
          <div key={group.label}>
            <div className="bg-background/95 sticky top-[-1px] z-10 -mx-4 mb-4 border-b border-transparent px-4 py-2 backdrop-blur-sm transition-colors group-has-[[data-sticky=true]]:border-border">
              <h3 className="text-base font-bold tracking-tight text-foreground/90">
                {group.label}
              </h3>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-muted h-9 animate-pulse rounded-md"
                    />
                  ))
                : slotsInGroup?.map((slot) => (
                    <SlotButton
                      key={slot.id}
                      time={format(
                        parse(
                          `${slot.date} ${slot.start_time}`,
                          "yyyy-MM-dd HH:mm",
                          new Date()
                        ),
                        "HH:mm"
                      )}
                      isAvailable={slot.is_available && !slot.is_held}
                      isSelected={
                        selectedSlot ? selectedSlot.id === slot.id : false
                      }
                      isDisabled={!slot.is_available}
                      onClick={() => onSelectSlot(slot)}
                    />
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
