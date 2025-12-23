"use client";

/**
 * ExceptionSheet - Sheet form để thêm/sửa ngày ngoại lệ
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.3
 * Pattern: service-sheet.tsx, staff-sheet.tsx
 *
 * [REFACTORED] Fix C1: Sử dụng Field component từ shared
 * [REFACTORED] Fix C2: Sử dụng EXCEPTION_TYPE_LABELS từ constants
 * [REFACTORED] Fix E2: Check duplicate exception date
 * [REFACTORED] Fix C4: Icon semantic (Plus thay vì Send)
 */

import {
  Button,
  DatePicker,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  TimeRangeInput,
} from "@/shared/ui";
import { isSameDay } from "date-fns";
import { AlertTriangle, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_EXCEPTION_CLOSE,
  DEFAULT_EXCEPTION_OPEN,
  EXCEPTION_TYPE_LABELS,
} from "./constants";
import { ExceptionDate, ExceptionType } from "./types";

interface ExceptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exception?: ExceptionDate; // undefined = create mode
  onSave: (exception: ExceptionDate) => void;
  /** Danh sách exceptions hiện có để kiểm tra trùng lặp (Fix E2) */
  existingExceptions?: ExceptionDate[];
}

export function ExceptionSheet({
  open,
  onOpenChange,
  exception,
  onSave,
  existingExceptions = [],
}: ExceptionSheetProps) {
  const isEditMode = !!exception;

  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, setType] = useState<ExceptionType>("HOLIDAY");
  const [reason, setReason] = useState("");
  const [isClosed, setIsClosed] = useState(true);
  const [openTime, setOpenTime] = useState(DEFAULT_EXCEPTION_OPEN);
  const [closeTime, setCloseTime] = useState(DEFAULT_EXCEPTION_CLOSE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opening/closing
  useEffect(() => {
    if (open) {
      if (exception) {
        // Edit mode - populate form
        setDate(exception.date);
        setType(exception.type);
        setReason(exception.reason);
        setIsClosed(exception.isClosed);
        setOpenTime(exception.openTime || DEFAULT_EXCEPTION_OPEN);
        setCloseTime(exception.closeTime || DEFAULT_EXCEPTION_CLOSE);
      } else {
        // Create mode - reset form
        setDate(undefined);
        setType("HOLIDAY");
        setReason("");
        setIsClosed(true);
        setOpenTime(DEFAULT_EXCEPTION_OPEN);
        setCloseTime(DEFAULT_EXCEPTION_CLOSE);
      }
    }
  }, [open, exception]);

  // Check duplicate date (Fix E2)
  const duplicateCheck = useMemo(() => {
    if (!date) return { isDuplicate: false };

    const duplicate = existingExceptions.find((e) => {
      // Không so sánh với chính nó khi edit
      if (exception && e.id === exception.id) return false;
      return isSameDay(new Date(e.date), date);
    });

    if (duplicate) {
      return {
        isDuplicate: true,
        duplicateId: duplicate.id,
        message: `Ngày này đã có ngoại lệ "${duplicate.reason}". Vui lòng chọn ngày khác hoặc sửa ngoại lệ hiện có.`,
      };
    }

    return { isDuplicate: false };
  }, [date, existingExceptions, exception]);

  // Handle submit
  const handleSubmit = async () => {
    if (!date || !reason.trim() || duplicateCheck.isDuplicate) return;

    setIsSubmitting(true);

    try {
      const newException: ExceptionDate = {
        id: exception?.id || `exc-${Date.now()}`,
        date,
        type,
        reason: reason.trim(),
        isClosed,
        openTime: isClosed ? undefined : openTime,
        closeTime: isClosed ? undefined : closeTime,
      };

      onSave(newException);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation
  const isValid =
    date && reason.trim().length > 0 && !duplicateCheck.isDuplicate;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-lg">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <SheetTitle className="text-foreground text-lg font-semibold">
            {isEditMode ? "Sửa ngày ngoại lệ" : "Thêm ngày ngoại lệ"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <div className="space-y-6 p-6">
            {/* Date Picker (Fix E2: Show duplicate warning) */}
            <Field data-invalid={duplicateCheck.isDuplicate}>
              <FieldLabel>
                Ngày <span className="text-destructive">*</span>
              </FieldLabel>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Chọn ngày"
                disabled={isSubmitting}
              />
              {duplicateCheck.isDuplicate && (
                <FieldError>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>{duplicateCheck.message}</span>
                  </div>
                </FieldError>
              )}
            </Field>

            {/* Exception Type */}
            <Field>
              <FieldLabel>
                Loại ngoại lệ <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ExceptionType)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EXCEPTION_TYPE_LABELS) as ExceptionType[]).map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {EXCEPTION_TYPE_LABELS[t]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>

            {/* Reason */}
            <Field>
              <FieldLabel>
                Lý do / Ghi chú <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="VD: Tết Nguyên Đán, Bảo trì hệ thống..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
              />
              <FieldDescription>
                Mô tả ngắn gọn lý do cho ngày ngoại lệ này
              </FieldDescription>
            </Field>

            {/* Is Closed Toggle */}
            <Field>
              <FieldLabel>Trạng thái hoạt động</FieldLabel>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {isClosed ? "Đóng cửa cả ngày" : "Hoạt động giờ đặc biệt"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isClosed
                      ? "Spa sẽ không nhận khách trong ngày này"
                      : "Spa mở cửa với giờ khác thường lệ"}
                  </p>
                </div>
                <Switch
                  checked={!isClosed}
                  onCheckedChange={(checked) => setIsClosed(!checked)}
                  disabled={isSubmitting}
                />
              </div>
            </Field>

            {/* Custom Hours (only if not closed) */}
            {!isClosed && (
              <Field>
                <FieldLabel>Giờ hoạt động</FieldLabel>
                <TimeRangeInput
                  startTime={openTime}
                  endTime={closeTime}
                  onStartTimeChange={setOpenTime}
                  onEndTimeChange={setCloseTime}
                />
              </Field>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            className="min-w-[120px]"
            startContent={
              isEditMode ? (
                <Save className="size-4" />
              ) : (
                <Plus className="size-4" />
              )
            }
          >
            {isEditMode ? "Cập nhật" : "Thêm ngày"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
