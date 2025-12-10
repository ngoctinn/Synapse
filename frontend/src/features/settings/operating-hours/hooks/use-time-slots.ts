
import { useCallback } from "react";
import { DEFAULT_BUSINESS_HOURS } from "../model/constants";

export interface TimeSlot {
  start: string;
  end: string;
}

export function useTimeSlots(
  slots: TimeSlot[] | undefined | null,
  onChange: (newSlots: TimeSlot[]) => void
) {
  const safeSlots = slots || [];

  const addSlot = useCallback(() => {
    const newSlots = [...safeSlots, { ...DEFAULT_BUSINESS_HOURS[0] }];
    onChange(newSlots);
  }, [safeSlots, onChange]);

  const updateSlot = useCallback(
    (index: number, field: "start" | "end", value: string) => {
      if (!safeSlots[index]) return;
      const newSlots = [...safeSlots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      onChange(newSlots);
    },
    [safeSlots, onChange]
  );

  const removeSlot = useCallback(
    (index: number) => {
      const newSlots = safeSlots.filter((_, i) => i !== index);
      onChange(newSlots);
    },
    [safeSlots, onChange]
  );

  return {
    slots: safeSlots,
    addSlot,
    updateSlot,
    removeSlot,
  };
}
