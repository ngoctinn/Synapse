"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/shared/ui";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-md">
        {/* Header */}
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <SheetTitle className="text-lg font-semibold">
            Thêm ca làm việc
          </SheetTitle>
          {staffName && date && (
            <p className="text-muted-foreground mt-1 text-sm">
              Chọn ca cho{" "}
              <strong className="text-foreground">{staffName}</strong>
              <br />
              <span className="capitalize">{dateStr}</span>
            </p>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="sheet-scroll-area">
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

        {/* Footer */}
        <SheetFooter className="bg-background border-t px-6 py-3">
          <Button
            variant="outline"
            className="h-9 w-full"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
