"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { format, isSameDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { ExceptionDate } from "../model/types";

import { DEFAULT_BUSINESS_HOURS, EXCEPTION_TYPES } from "../model/constants";

interface ExceptionFormProps {
  initialData?: Partial<ExceptionDate> | null;
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  onSubmit: (data: Partial<ExceptionDate>) => void;
  /** If true, the submit button is rendered by the parent dialog */
  hideFooter?: boolean;
  secondaryAction?: React.ReactNode;
  id?: string;
}

export function ExceptionForm({
  initialData,
  selectedDates,
  onDatesChange,
  onSubmit,
  hideFooter = false,
  secondaryAction,
  id
}: ExceptionFormProps) {

  // --- Form State ---
  const [formData, setFormData] = useState<Partial<ExceptionDate>>({
    type: 'holiday',
    isClosed: true,
    reason: '',
    modifiedHours: []
  });

  // Temporary date for input
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        reason: initialData.reason || '',
        type: initialData.type || 'holiday',
        isClosed: initialData.isClosed ?? true,
        modifiedHours: initialData.modifiedHours || []
      });
    }
  }, [initialData]);

  // --- Date Logic (Hybrid: Range + Disjoint) ---


  // --- Date Logic (Multiple Selection) ---

  const handleAddTempDate = () => {
      if (!tempDate) return;

      // Check if date already exists
      const exists = selectedDates.some(d => isSameDay(d, tempDate));
      if (exists) {
          // Removes date if available
          onDatesChange(selectedDates.filter(d => !isSameDay(d, tempDate)));
      } else {
          // Adds date if not available
          onDatesChange([...selectedDates, tempDate]);
      }
      setTempDate(undefined);
  };


  const handleRemoveDate = (dateToRemove: Date) => {
      onDatesChange(selectedDates.filter(d => !isSameDay(d, dateToRemove)));
  };

  // --- Form Logic ---

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
      const newSlots = [...(formData.modifiedHours || [])];
      if (!newSlots[index]) return;
      newSlots[index] = { ...newSlots[index], [field]: value };
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  const handleAddSlot = () => {
      const newSlots = [...(formData.modifiedHours || []), { ...DEFAULT_BUSINESS_HOURS[0] }];
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  const handleRemoveSlot = (index: number) => {
      const newSlots = (formData.modifiedHours || []).filter((_, i) => i !== index);
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  // Auto-fill slots when switching to "Open"
  useEffect(() => {
     if (!formData.isClosed && (!formData.modifiedHours || formData.modifiedHours.length === 0)) {
         setFormData(prev => ({ ...prev, modifiedHours: [...DEFAULT_BUSINESS_HOURS] }));
     }
  }, [formData.isClosed]);

  const handleSubmit = () => {
    // Basic validation
    if (!formData.reason?.trim()) return;

    if (formData.isClosed) {
        onSubmit({
            ...formData,
            modifiedHours: [] // Clear hours if closed
        });
    } else {
        onSubmit(formData);
    }
  };

  // Expose submit handler via Ref if needed, or Parent controls it.
  // Ideally parent passes a ref, but here we keep it simple:
  // If hideFooter is false, we show our own button.

  return (
    <form
        id={id || (hideFooter ? "exception-form" : undefined)}
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}
        className="space-y-6 pt-2"
    >

      {/* 1. Date Selection Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
            <Label className="text-foreground/80 font-normal">Thời gian áp dụng</Label>

            <div className="flex gap-3 items-end">
                 <div className="flex-1">
                     <BirthdayPicker
                        date={tempDate}
                        setDate={setTempDate}
                        placeholder="Chọn ngày ngoại lệ..."
                        className="bg-background w-full"
                    />
                 </div>
                 <Button
                    onClick={handleAddTempDate}
                    disabled={!tempDate}
                    type="button"
                    variant="outline"
                    className="shrink-0 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm
                </Button>
            </div>
        </div>

        {/* Selected Dates Chips (Hybrid View) */}
        {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
                {selectedDates.map((date, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-secondary/50 text-foreground border border-border px-3 py-1.5 rounded-full text-xs font-medium animate-in fade-in zoom-in-95 duration-200 group">
                        {format(date, 'dd/MM/yyyy')}
                        <button
                            onClick={() => handleRemoveDate(date)}
                            className="ml-1.5 p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Xóa ngày ${format(date, 'dd/MM/yyyy')}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        )}
        {selectedDates.length === 0 && (
            <div className="text-xs text-muted-foreground italic pl-1">
                Chưa chọn ngày nào.
            </div>
        )}
      </div>

      <div className="h-[1px] bg-border/50" />

      {/* 2. Reason Input */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-foreground/80 font-normal">Lý do / Tên sự kiện</Label>
        <InputWithIcon
            id="reason"
            value={formData.reason || ''}
            onChange={e => setFormData({...formData, reason: e.target.value})}
            placeholder="Ví dụ: Tết Nguyên Đán, Bảo trì định kỳ..."
            className="bg-background"
        />
      </div>

      {/* 3. Type Selection */}
      <div className="space-y-3">
        <Label className="text-foreground/80 font-normal">Loại sự kiện</Label>
        <div className="grid grid-cols-3 gap-3">
            {EXCEPTION_TYPES.map((type) => (
            <div
                key={type.id}
                onClick={() => setFormData({...formData, type: type.id})}
                className={cn(
                "cursor-pointer rounded-lg border p-3 flex flex-col items-center gap-2 transition-all duration-200 hover:bg-accent/50 hover:border-primary/30 active:scale-95 relative",
                formData.type === type.id
                    ? cn("bg-primary/5 border-primary shadow-sm", type.border)
                    : "bg-background border-border"
                )}
            >
                <div className={cn("p-2 rounded-full", formData.type === type.id ? "bg-background" : "bg-secondary")}>
                <type.icon className={cn("w-4 h-4", type.color)} />
                </div>
                <span className={cn("text-xs font-medium", formData.type === type.id && "text-primary")}>{type.label}</span>
            </div>
            ))}
        </div>
      </div>

      <div className="h-[1px] bg-border/50" />

      {/* 4. Open/Close Status & Hours */}
      <div className="space-y-4">
         <Label className="text-foreground/80 font-normal flex items-center gap-2">
             <Clock className="w-4 h-4 text-muted-foreground" />
             Trạng thái & Thời gian
         </Label>

         <div className="border rounded-xl p-4 space-y-4 bg-background transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Switch
                    id="closed"
                    checked={formData.isClosed}
                    onCheckedChange={checked => setFormData({...formData, isClosed: checked})}
                    className="data-[state=checked]:bg-destructive"
                />
                <div className="flex flex-col">
                    <Label htmlFor="closed" className={cn("cursor-pointer text-sm font-medium transition-colors", formData.isClosed ? "text-destructive" : "text-foreground")}>
                        {formData.isClosed ? "Đóng cửa" : "Mở cửa (Giờ đặc biệt)"}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                    {formData.isClosed
                        ? "Không nhận lịch hẹn vào ngày này"
                        : "Hoạt động theo khung giờ tuỳ chỉnh"}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {!formData.isClosed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pl-1 border-t border-border/50 mt-2 space-y-3">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Khung giờ hoạt động</Label>
                            <div className="flex flex-wrap gap-3 w-full justify-end items-center">                                {(formData.modifiedHours || []).map((slot, index) => (
                                    <TimeRangeInput
                                        key={index}
                                        startTime={slot.start}
                                        endTime={slot.end}
                                        onStartTimeChange={(val) => handleTimeChange(index, 'start', val)}
                                        onEndTimeChange={(val) => handleTimeChange(index, 'end', val)}
                                        onRemove={() => handleRemoveSlot(index)}
                                        showRemoveButton={(formData.modifiedHours?.length || 0) > 1}
                                        className="w-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </div>

      {!hideFooter && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t mt-6">
              {secondaryAction && (
                <div className="w-full sm:w-auto">
                    {secondaryAction}
                </div>
              )}
              <Button type="submit" disabled={!formData.reason || selectedDates.length === 0} className="w-full sm:w-auto min-w-[100px]">
                {initialData ? "Cập nhật" : "Lưu thay đổi"}
              </Button>
          </div>
      )}
    </form>
  );
}
