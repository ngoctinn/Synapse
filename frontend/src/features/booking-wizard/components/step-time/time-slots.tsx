"use client";

import { format, parse } from "date-fns";
import React from "react";
import { TimeSlot } from "../../types";
import { SlotButton } from "./slot-button";

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

const timeOfDayGroups = [
  { label: "Sáng (6:00 - 12:00)", startHour: 6, endHour: 12 },
  { label: "Chiều (12:00 - 18:00)", startHour: 12, endHour: 18 },
  { label: "Tối (18:00 - 23:00)", startHour: 18, endHour: 23 },
];

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
      // Construct Date object from slot.date and slot.start_time
      const slotDateTime = parse(`${slot.date} ${slot.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
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

  return (
    <div className="space-y-6">
      {timeOfDayGroups.map((group) => {
        const slotsInGroup = groupedSlots[group.label];
        if (slotsInGroup && slotsInGroup.length === 0 && !isLoading) {
          return null; // Don't show empty groups unless loading
        }
        return (
          <div key={group.label}>
            <h3 className="text-lg font-semibold mb-3">{group.label}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-muted rounded-md animate-pulse"
                    />
                  ))
                : slotsInGroup?.map((slot) => (
                    <SlotButton
                      key={slot.id}
                      // Construct Date object for formatting time
                      time={format(parse(`${slot.date} ${slot.start_time}`, 'yyyy-MM-dd HH:mm', new Date()), "HH:mm")}
                      isAvailable={slot.is_available && !slot.is_held}
                      isSelected={selectedSlot ? selectedSlot.id === slot.id : false}
                      isDisabled={!slot.is_available} // Disable if not available
                      onClick={() => onSelectSlot(slot)}
                    />
                  ))}
            </div>
            {slotsInGroup && slotsInGroup.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-sm">Không có khung giờ nào.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
