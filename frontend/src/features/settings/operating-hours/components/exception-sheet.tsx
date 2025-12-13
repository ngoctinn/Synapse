"use client";

import { format } from "date-fns";
import { Save, Send, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/shared/ui/sheet";
import { useMemo } from "react";
import { ExceptionDate } from "../model/types";
import { ExceptionForm } from "./exception-form";

interface ExceptionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Existing exceptions (for checking current state of selected dates) */
  existingExceptions: ExceptionDate[];
  /** Currently selected dates (from Calendar or List) */
  selectedDates: Date[];
  /** Handler to change selected dates (if using Picker inside dialog) */
  onDatesChange: (dates: Date[]) => void;
  /** Submit handler */
  onSubmit: (data: Partial<ExceptionDate>) => void;
  /** Delete handler */
  onDelete?: () => void;
}

export function ExceptionSheet({
    isOpen,
    onClose,
    existingExceptions,
    selectedDates,
    onDatesChange,
    onSubmit,
    onDelete
}: ExceptionSheetProps) {

  // Check if we are editing existing exceptions
  const currentExceptions = useMemo(() => {
    const dateStrings = new Set(selectedDates.map(d => format(d, 'yyyy-MM-dd')));
    return existingExceptions.filter(e => dateStrings.has(format(e.date, 'yyyy-MM-dd')));
  }, [selectedDates, existingExceptions]);

  const isEditing = currentExceptions.length > 0;

  // Prepare initial data from the first selected exception (if any)
  const initialData = isEditing && currentExceptions[0]
      ? {
          reason: currentExceptions[0].reason,
          type: currentExceptions[0].type,
          isClosed: currentExceptions[0].isClosed,
          modifiedHours: currentExceptions[0].modifiedHours
        }
      : null;

  const title = isEditing ? "Chỉnh sửa ngoại lệ" : "Thêm ngoại lệ mới";
  const description = isEditing
      ? "Cập nhật thông tin cho các ngày ngoại lệ đã chọn."
      : "Thiết lập ngày nghỉ hoặc giờ làm việc đặc biệt cho spa.";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-3 border-b">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    {title}
                </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
                {description}
            </SheetDescription>
        </SheetHeader>

        <div className="sheet-scroll-area">
            <ExceptionForm
                id="exception-sheet-form"
                initialData={initialData}
                selectedDates={selectedDates}
                onDatesChange={onDatesChange}
                onSubmit={(data) => {
                    onSubmit(data);
                    onClose();
                }}
                hideFooter={true}
            />
        </div>

        <SheetFooter className="px-6 py-3 border-t sm:justify-between flex-row items-center gap-4 bg-background">
            <div className="flex items-center gap-2">
                {isEditing && onDelete && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onDelete}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        startContent={<Trash2 className="size-4" />}
                    >
                        Xóa
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Hủy bỏ
                </Button>
                <Button
                    type="submit"
                    form="exception-sheet-form"
                    disabled={selectedDates.length === 0}
                    className="min-w-[140px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    startContent={isEditing ? <Save className="size-4" /> : <Send className="size-4" />}
                >
                    {isEditing ? "Lưu thay đổi" : "Tạo ngoại lệ"}
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
