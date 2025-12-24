"use client";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CalendarClock } from "lucide-react";
import React, { useMemo, useState } from "react";
import { WaitlistSheet } from "@/features/waitlist/components/waitlist-sheet";
import { useTimeStepData } from "../../hooks/use-time-step-data";
import { DatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";

export const TimeStep: React.FC = () => {
  const {
    fetchedSlots,
    availableStaff,
    fetchError,
    isLoading,
    shouldFetch,
    staffId,
    setStaff,
    selectedDate,
    selectedSlot,
    setSelectedDate,
    setSelectedSlot,
    selectedServices,
  } = useTimeStepData();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const displayError = useMemo(() => {
    if (!shouldFetch) {
      return "Vui lòng chọn ít nhất một dịch vụ.";
    }
    return fetchError;
  }, [shouldFetch, fetchError]);

  const availableDates = useMemo(() => {
    if (!shouldFetch) return [];
    const dates = new Set<string>();
    fetchedSlots.forEach((slot) => dates.add(slot.date));
    return Array.from(dates)
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [fetchedSlots, shouldFetch]);

  return (
    <div className="space-y-6 p-4">
      {displayError && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Staff Preference Filter */}
      <div className="w-full">
        <h2 className="mb-3 text-lg font-semibold">Nhân viên ưu tiên</h2>
        <Select
          value={staffId || "any"}
          onValueChange={(val) => {
            const selected = availableStaff.find((s) => s.id === val);
            setStaff(
              val === "any" ? "any" : val,
              selected?.name || "Bất kỳ nhân viên"
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn nhân viên (tùy chọn)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Bất kỳ nhân viên (Nhanh nhất)</SelectItem>
            {availableStaff.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Picker */}
      <div className="w-full">
        <h2 className="mb-3 text-lg font-semibold">Chọn ngày</h2>
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
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <CalendarClock className="size-5" />
            <span>
              Khung giờ khả dụng{" "}
              {new Date(selectedDate).toLocaleDateString("vi-VN")}
            </span>
          </h2>
          {fetchedSlots.length > 0 ? (
            <TimeSlots
              timeSlots={fetchedSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              isLoading={isLoading}
            />
          ) : (
            <Alert className="bg-muted/50 text-muted-foreground flex flex-col items-center gap-4 border-dashed py-8 text-center">
              <div className="space-y-2">
                <AlertTitle className="text-xl">Hết chỗ!</AlertTitle>
                <AlertDescription className="text-base lowercase first-letter:uppercase">
                  Rất tiếc, ngày{" "}
                  {new Date(selectedDate).toLocaleDateString("vi-VN")} hiện đã
                  full lịch.
                </AlertDescription>
              </div>
              <div className="flex w-full max-w-xs flex-col gap-2">
                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-medium transition-colors"
                >
                  Đăng ký danh sách chờ
                </button>
                <p className="text-xs">
                  Chúng tôi sẽ thông báo ngay khi có ai đó hủy lịch.
                </p>
              </div>
            </Alert>
          )}
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistSheet
        mode="create"
        open={isWaitlistOpen}
        onOpenChange={setIsWaitlistOpen}
        defaultValues={{
          service_id: selectedServices[0]?.id,
          preferred_date: selectedDate
            ? new Date(selectedDate).toISOString()
            : undefined,
        }}
      />
    </div>
  );
};
