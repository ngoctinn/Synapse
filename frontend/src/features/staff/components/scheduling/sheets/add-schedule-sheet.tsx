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
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold">Thêm ca làm việc</SheetTitle>
          {staffName && date && (
            <p className="text-sm text-muted-foreground mt-1">
              Chọn ca cho <strong className="text-foreground">{staffName}</strong>
              <br />
              <span className="capitalize">{dateStr}</span>
            </p>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="sheet-scroll-area">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
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
              <div className="text-center py-8 text-muted-foreground">
                Chưa có ca làm việc nào. Vui lòng tạo ca trước.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-3 border-t bg-background">
          <Button variant="outline" className="w-full h-9" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
