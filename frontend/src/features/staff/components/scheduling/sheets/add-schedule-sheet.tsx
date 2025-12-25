"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Button, SheetClose } from "@/shared/ui";
import { ActionSheet } from "@/shared/ui/custom";

import { MOCK_SHIFTS } from "../../../model/shifts";
import { Shift } from "../../../model/types";
import { ShiftChipLarge } from "../calendar/shift-chip";

interface AddScheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffName?: string;
  date?: Date;
  onSelectShift: (shift: Shift) => void;
}

/**
 * Sheet để thêm ca làm việc cho nhân viên
 */
export function AddScheduleSheet({
  open,
  onOpenChange,
  staffName,
  date,
  onSelectShift,
}: AddScheduleSheetProps) {
  const dateStr = date ? format(date, "EEEE, dd/MM/yyyy", { locale: vi }) : "";

  const handleSelectShift = (shift: Shift) => {
    onSelectShift(shift);
    onOpenChange(false);
  };

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm ca làm việc"
      description="Chọn ca làm việc cho nhân viên"
      size="sm"
      footer={
        <SheetClose asChild>
          <Button variant="outline" className="w-full">
            Hủy
          </Button>
        </SheetClose>
      }
    >
      <div className="space-y-4">
        {staffName && date && (
          <p className="text-muted-foreground mb-4 text-sm">
            Chọn ca cho{" "}
            <strong className="text-foreground">{staffName}</strong>
            <br />
            <span className="capitalize">{dateStr}</span>
          </p>
        )}

        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">
            Chọn ca làm việc:
          </p>

          {MOCK_SHIFTS.map((shift) => (
            <ShiftChipLarge
              key={shift.id}
              shift={shift}
              onClick={() => handleSelectShift(shift)}
            />
          ))}

          {MOCK_SHIFTS.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              Chưa có ca làm việc nào. Vui lòng tạo ca trước.
            </div>
          )}
        </div>
      </div>
    </ActionSheet>
  );
}
