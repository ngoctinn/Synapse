"use client";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { isSameDay } from "date-fns";
import { AlertCircle, CalendarClock } from "lucide-react";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { getAvailableSlots } from "../../actions";
import { useBookingStore } from "../../hooks/use-booking-store";
import { TimeSlot, StaffItem } from "../../types";
import { DatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { getAvailableStaff } from "../../actions";
import { WaitlistSheet } from "@/features/waitlist/components/waitlist-sheet";

export const TimeStep: React.FC = () => {
  const { selectedServices, staffId, setStaff, selectedDate, selectedSlot, setSelectedDate, setSelectedSlot } = useBookingStore();

  const [fetchedSlots, setFetchedSlots] = useState<TimeSlot[]>([]);
  const [availableStaff, setAvailableStaff] = useState<StaffItem[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const shouldFetch = selectedServices.length > 0;

  const displayError = useMemo(() => {
    if (!shouldFetch) {
      return "Vui lòng chọn ít nhất một dịch vụ.";
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
    return fetchedSlots; // Backend already filtered by date
  }, [fetchedSlots, selectedDate, shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) {
      startTransition(() => {
        setFetchedSlots([]);
        setSelectedDate(null);
      });
      return;
    }

    const fetchData = async () => {
      setFetchError(null);
      const dateToFetch = selectedDate ? new Date(selectedDate) : new Date();

      const [slotsRes, staffRes] = await Promise.all([
        getAvailableSlots({
          serviceIds: selectedServices.map(s => s.id),
          staffId: staffId || 'any',
          date: dateToFetch,
        }),
        getAvailableStaff({
          serviceIds: selectedServices.map(s => s.id)
        })
      ]);

      if (staffRes.status === "success" && staffRes.data) {
        setAvailableStaff(staffRes.data);
      }

      if (slotsRes.status === "success" && slotsRes.data) {
        setFetchedSlots(slotsRes.data);
        if (!selectedDate && slotsRes.data.length > 0) {
          // If no date selected, default to the first available date from backend
          setSelectedDate(new Date(slotsRes.data[0].date));
        }
      } else {
        setFetchError(slotsRes.message || "Không thể tải khung giờ. Vui lòng thử lại.");
        setFetchedSlots([]);
      }
    };

    startTransition(fetchData);
  }, [selectedServices, staffId, selectedDate, setSelectedDate, shouldFetch]);

  return (
    <div className="space-y-6 p-4">
      {/* Staff Preference Filter */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-3">Nhân viên ưu tiên</h2>
        <Select
          value={staffId || 'any'}
          onValueChange={(val) => {
            const selected = availableStaff.find(s => s.id === val);
            setStaff(val === 'any' ? 'any' : val, selected?.name || 'Ngẫu nhiên');
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn nhân viên (tùy chọn)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Bất kỳ nhân viên (Nhanh nhất)</SelectItem>
            {availableStaff.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            <span>Khung giờ khả dụng {new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
          </h2>
          {slotsForSelectedDate.length > 0 ? (
            <TimeSlots
              timeSlots={slotsForSelectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              isLoading={isLoading}
            />
          ) : (
            <Alert className="bg-muted/50 text-muted-foreground border-dashed py-8 flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <AlertTitle className="text-xl">Hết chỗ!</AlertTitle>
                <AlertDescription className="text-base lowercase first-letter:uppercase">
                  Rất tiếc, ngày {new Date(selectedDate).toLocaleDateString('vi-VN')} hiện đã full lịch.
                </AlertDescription>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                 <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Đăng ký danh sách chờ
                </button>
                <p className="text-xs">Chúng tôi sẽ thông báo ngay khi có ai đó hủy lịch.</p>
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
          preferred_date: selectedDate ? new Date(selectedDate).toISOString() : undefined
        }}
      />
    </div>
  );
};