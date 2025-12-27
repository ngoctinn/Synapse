import { toast } from "sonner";
import { ScheduleWithShift, Shift } from "../../../model/types";

interface UseBatchOperationsProps {
  selectedSlots: { staffId: string; dateStr: string }[];
  draftSchedules: ScheduleWithShift[];
  getSchedulesForCell: (staffId: string, dateStr: string) => ScheduleWithShift[];
  batchAddSchedules: (slots: { staffId: string; dateStr: string }[], shift: Shift) => void;
  batchPublishSchedules: (scheduleIds: string[]) => void;
  batchRemoveSchedules: (scheduleIds: string[]) => void;
  clearSelection: () => void;
}

export function useBatchOperations({
  selectedSlots,
  draftSchedules,
  getSchedulesForCell,
  batchAddSchedules,
  batchPublishSchedules,
  batchRemoveSchedules,
  clearSelection,
}: UseBatchOperationsProps) {

  const handleBatchApplyShift = (shift: Shift) => {
    batchAddSchedules(selectedSlots, shift);
    clearSelection();
  };

  const handleBatchPublish = () => {
    // Get all schedule IDs for selected slots
    const scheduleIds: string[] = [];
    selectedSlots.forEach(({ staffId, dateStr }) => {
      const cellSchedules = getSchedulesForCell(staffId, dateStr);
      cellSchedules.forEach((s) => {
        if (s.status === "DRAFT") {
          scheduleIds.push(s.id);
        }
      });
    });

    if (scheduleIds.length > 0) {
      batchPublishSchedules(scheduleIds);
    } else {
      toast.info("Không có lịch nháp nào để công bố");
    }
    clearSelection();
  };

  const handleBatchDelete = () => {
    // Get all schedule IDs for selected slots
    const scheduleIds: string[] = [];
    selectedSlots.forEach(({ staffId, dateStr }) => {
      const cellSchedules = getSchedulesForCell(staffId, dateStr);
      cellSchedules.forEach((s) => scheduleIds.push(s.id));
    });

    if (scheduleIds.length > 0) {
      batchRemoveSchedules(scheduleIds);
    } else {
      toast.info("Không có lịch nào để xóa");
    }
    clearSelection();
  };

  const handlePublishAll = () => {
    const draftIds = draftSchedules.map((s) => s.id);
    if (draftIds.length > 0) {
      batchPublishSchedules(draftIds);
    }
  };

  return {
    handleBatchApplyShift,
    handleBatchPublish,
    handleBatchDelete,
    handlePublishAll,
  };
}
