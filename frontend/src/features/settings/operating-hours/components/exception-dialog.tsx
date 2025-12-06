"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ExceptionDate } from "../model/types";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ExceptionForm } from "./exception-form";

interface ExceptionDialogProps {
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

export function ExceptionDialog({
  isOpen,
  onClose,
  existingExceptions,
  selectedDates,
  onDatesChange,
  onSubmit,
  onDelete
}: ExceptionDialogProps) {
  
  // Check if we are editing existing exceptions
  const currentExceptions = useMemo(() => {
    const dateStrings = new Set(selectedDates.map(d => format(d, 'yyyy-MM-dd')));
    return existingExceptions.filter(e => dateStrings.has(format(e.date, 'yyyy-MM-dd')));
  }, [selectedDates, existingExceptions]);

  const isEditing = currentExceptions.length > 0;
  
  // Prepare initial data from the first selected exception (if any)
  // Logic: In bulk edit, we usually take the first item's properties as default
  const initialData = isEditing && currentExceptions[0] 
      ? {
          reason: currentExceptions[0].reason,
          type: currentExceptions[0].type,
          isClosed: currentExceptions[0].isClosed,
          modifiedHours: currentExceptions[0].modifiedHours
        }
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] gap-0 p-0 overflow-hidden outline-none">
        <DialogHeader className="p-6 pb-2 border-b bg-muted/5">
          <DialogTitle className="text-xl flex items-center gap-2">
              {isEditing ? (
                  <>
                    <CalendarDays className="w-5 h-5 text-primary" />
                    Chỉnh sửa ngoại lệ
                  </>
              ) : (
                  <>
                    <Plus className="w-5 h-5 text-primary" />
                    Thêm ngoại lệ mới
                  </>
              )}
          </DialogTitle>
           <div className="text-sm text-muted-foreground mt-1">
             {selectedDates.length > 0 
                ? `Đang chọn ${selectedDates.length} ngày`
                : "Chọn ngày để thiết lập kỳ nghỉ hoặc giờ làm việc đặc biệt."}
           </div>
        </DialogHeader>

        <div className="px-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <ExceptionForm 
                initialData={initialData}
                selectedDates={selectedDates}
                onDatesChange={onDatesChange}
                onSubmit={(data) => {
                    onSubmit(data);
                    onClose();
                }}
                secondaryAction={
                    isEditing && onDelete ? (
                        <Button variant="ghost" className="text-destructive hover:bg-destructive/10 gap-2 h-10 px-4" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" /> Xóa
                        </Button>
                    ) : null
                }
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
