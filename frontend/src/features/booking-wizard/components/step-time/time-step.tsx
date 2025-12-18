"use client";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { isSameDay } from "date-fns";
import { AlertCircle, CalendarClock } from "lucide-react";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { getAvailableSlots } from "../../actions";
import { useBookingStore } from "../../hooks/use-booking-store";
import { TimeSlot } from "../../types";
import { DatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";

export const TimeStep: React.FC = () => {
  const { selectedServices, staffId, selectedDate, selectedSlot, setSelectedDate, setSelectedSlot } = useBookingStore();

  const [fetchedSlots, setFetchedSlots] = useState<TimeSlot[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const shouldFetch = staffId && selectedServices.length > 0;

  const displayError = useMemo(() => {
    if (!shouldFetch) {
      return "Vui lòng chọn KTV và dịch vụ để xem lịch.";
    }
    return fetchError;
  }, [shouldFetch, fetchError]);

  const availableDates = useMemo(() => {
    if (!shouldFetch) return [];
    const dates = new Set<string>();
    fetchedSlots.forEach(slot => dates.add(slot.date));
    return Array.from(dates).map(dateStr => new Date(dateStr)).sort((a,b) => a.getTime() - b.getTime());
  }, [fetchedSlots, shouldFetch]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate || !shouldFetch) return [];
    const dateObj = new Date(selectedDate);
    return fetchedSlots.filter(slot => isSameDay(new Date(slot.date), dateObj));
  }, [fetchedSlots, selectedDate, shouldFetch]);

  // Effect for fetching data
  useEffect(() => {
    if (!shouldFetch) {
      // Clear data inside a transition to avoid performance warnings
      startTransition(() => {
        setFetchedSlots([]);
        setSelectedDate(null);
      });
      return;
    }

    startTransition(async () => {
        setFetchError(null);
        const dateToFetch = selectedDate ? new Date(selectedDate) : new Date();
        const result = await getAvailableSlots({
            serviceIds: selectedServices.map(s => s.id),
            staffId: staffId,
            date: dateToFetch,
        });

        if (result.status === "success" && result.data) {
            setFetchedSlots(result.data);
            const currentDateObj = selectedDate ? new Date(selectedDate) : null;
            if (!currentDateObj || !result.data.some(slot => isSameDay(new Date(slot.date), currentDateObj))) {
                if (result.data.length > 0) {
                    setSelectedDate(new Date(result.data[0].date));
                } else {
                    setSelectedDate(null);
                }
            }
        } else {
            setFetchError(result.message || "Không thể tải khung giờ. Vui lòng thử lại.");
            setFetchedSlots([]); // Clear slots on error
            setSelectedDate(null); // Clear selected date on error
        }
    });
  }, [selectedServices, staffId, selectedDate, setSelectedDate, shouldFetch]);

  return (
    <div className="space-y-6 p-4">
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Date Picker */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-3">Chọn ngày</h2>
        <DatePicker
          selectedDate={selectedDate ? new Date(selectedDate) : null}
          onSelectDate={setSelectedDate}
          availableDates={availableDates}
          isLoading={isLoading}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarClock className="size-5" />
            <span>Chọn khung giờ cho {new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
          </h2>
          {slotsForSelectedDate.length > 0 ? (
            <TimeSlots
              timeSlots={slotsForSelectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              isLoading={isLoading}
            />
          ) : (
            <Alert className="bg-muted/50 text-muted-foreground border-dashed">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không có khung giờ</AlertTitle>
              <AlertDescription>
                Không có khung giờ khả dụng cho ngày đã chọn hoặc đang tải.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};
