import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

import { checkConflicts } from "@/features/appointments/actions";
import type { ConflictInfo } from "@/features/appointments/model/types";
import type { QuickAppointmentFormValues } from "@/features/appointments/model/schemas";
import { MockService } from "@/features/appointments/model/mocks";

interface ConflictCheckParams {
  form: UseFormReturn<QuickAppointmentFormValues>;
  availableServices: MockService[];
  appointmentId?: string;
}

interface ConflictCheckResult {
  conflicts: ConflictInfo[];
  timeWarning: string | null;
  totalDuration: number;
}

/**
 * Hook kiểm tra xung đột lịch hẹn và cảnh báo thời gian
 * Debounced 500ms để tránh gọi API quá nhiều
 */
export function useConflictCheck({
  form,
  availableServices,
  appointmentId,
}: ConflictCheckParams): ConflictCheckResult {
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);

  const watchedDate = useWatch({ control: form.control, name: "date" });
  const watchedStartTime = useWatch({ control: form.control, name: "startTime" });
  const watchedStaffId = useWatch({ control: form.control, name: "staffId" });
  const watchedServiceIds = useWatch({ control: form.control, name: "serviceIds" });

  // Tính tổng thời lượng dịch vụ
  const totalDuration = (watchedServiceIds || []).reduce((acc, serviceId) => {
    const service = availableServices.find((s) => s.id === serviceId);
    return acc + (service?.duration || 0);
  }, 0);

  // Kiểm tra xung đột với debounce
  useEffect(() => {
    const debouncedCheck = setTimeout(async () => {
      if (!watchedStaffId || !watchedStartTime || !watchedDate || !watchedServiceIds?.length) {
        setConflicts([]);
        setTimeWarning(null);
        return;
      }

      // Kiểm tra giờ làm việc (08:00 - 21:00)
      const [hours] = watchedStartTime.split(":").map(Number);
      if (hours < 8 || hours >= 21) {
        setTimeWarning("Ngoài giờ làm việc (08:00 - 21:00)");
      } else {
        setTimeWarning(null);
      }

      // Tính thời gian bắt đầu và kết thúc
      const [h, m] = watchedStartTime.split(":").map(Number);
      const start = new Date(watchedDate);
      start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + (totalDuration || 60) * 60000);

      // Gọi API kiểm tra xung đột
      const res = await checkConflicts(watchedStaffId, start, end, appointmentId);
      setConflicts((res.status === "success" && res.data) ? res.data : []);
    }, 500);

    return () => clearTimeout(debouncedCheck);
  }, [watchedDate, watchedStartTime, watchedStaffId, watchedServiceIds, appointmentId, totalDuration]);

  return { conflicts, timeWarning, totalDuration };
}
