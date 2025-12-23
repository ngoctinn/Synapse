import { useEffect, useState, useTransition } from "react";
import { getAvailableSlots, getAvailableStaff } from "../actions";
import { useBookingStore } from "./use-booking-store";
import { StaffItem, TimeSlot } from "../types";

/**
 * useTimeStepData
 *
 * Custom hook xử lý logic fetch dữ liệu cho TimeStep.
 * Bao gồm: fetch khung giờ khả dụng và danh sách nhân viên.
 */
export function useTimeStepData() {
  const {
    selectedServices,
    staffId,
    setStaff,
    selectedDate,
    selectedSlot,
    setSelectedDate,
    setSelectedSlot,
  } = useBookingStore();

  const [fetchedSlots, setFetchedSlots] = useState<TimeSlot[]>([]);
  const [availableStaff, setAvailableStaff] = useState<StaffItem[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const shouldFetch = selectedServices.length > 0;

  useEffect(() => {
    let isCancelled = false;

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

      try {
        const [slotsRes, staffRes] = await Promise.all([
          getAvailableSlots({
            serviceIds: selectedServices.map((s) => s.id),
            staffId: staffId || "any",
            date: dateToFetch,
          }),
          getAvailableStaff({
            serviceIds: selectedServices.map((s) => s.id),
          }),
        ]);

        if (isCancelled) return;

        if (staffRes.status === "success" && staffRes.data) {
          setAvailableStaff(staffRes.data);
        }

        if (slotsRes.status === "success" && slotsRes.data) {
          setFetchedSlots(slotsRes.data);
          // Auto-select date if none selected
          if (!selectedDate && slotsRes.data.length > 0) {
            setSelectedDate(new Date(slotsRes.data[0].date));
          }
        } else {
          setFetchError(
            slotsRes.message || "Không thể tải khung giờ. Vui lòng thử lại."
          );
          setFetchedSlots([]);
        }
      } catch (err) {
        if (isCancelled) return;
        setFetchError("Đã xảy ra lỗi khi kết nối máy chủ.");
        console.error("Fetch Data Error:", err);
      }
    };

    startTransition(fetchData);

    return () => {
      isCancelled = true;
    };
  }, [selectedServices, staffId, selectedDate, setSelectedDate, shouldFetch]);

  return {
    fetchedSlots,
    availableStaff,
    fetchError,
    isLoading,
    shouldFetch,
    // Store values/actions
    staffId,
    setStaff,
    selectedDate,
    selectedSlot,
    setSelectedDate,
    setSelectedSlot,
    selectedServices,
  };
}
