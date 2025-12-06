"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DateRangePicker } from "@/shared/ui/custom/date-range-picker";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { eachDayOfInterval } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, PartyPopper, Plus, Settings2, Sparkles, Trash2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { ExceptionDate } from "../model/types";

interface ExceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ExceptionDate>) => void;
  initialData?: ExceptionDate | null;
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
}

export function ExceptionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  selectedDates,
  onDatesChange
}: ExceptionFormProps) {
  const [formData, setFormData] = useState<Partial<ExceptionDate>>({
    type: 'holiday',
    isClosed: true,
    reason: '',
    modifiedHours: []
  });

  // Convert Date[] to DateRange for picker
  const dateRange: DateRange | undefined = selectedDates.length > 0 ? {
    from: selectedDates[0],
    to: selectedDates[selectedDates.length - 1]
  } : undefined;

  const handleRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
        const dates = eachDayOfInterval({ start: range.from, end: range.to });
        onDatesChange(dates);
    } else if (range?.from) {
        onDatesChange([range.from]);
    } else {
        onDatesChange([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          reason: initialData.reason,
          type: initialData.type,
          isClosed: initialData.isClosed,
          modifiedHours: initialData.modifiedHours || []
        });
      } else {
        setFormData({
          type: 'holiday',
          isClosed: true,
          reason: '',
          modifiedHours: []
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (formData.reason) {
      // Ensure modifiedHours is populated if not closed
      if (!formData.isClosed && (!formData.modifiedHours || formData.modifiedHours.length === 0)) {
         // Default to business hours
         onSubmit({
             ...formData,
             modifiedHours: [{ start: "08:00", end: "17:00" }]
         });
      } else {
         onSubmit(formData);
      }
    }
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
      const newSlots = [...(formData.modifiedHours || [])];
      if (!newSlots[index]) return;
      newSlots[index] = { ...newSlots[index], [field]: value };
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  const handleAddSlot = () => {
      const newSlots = [...(formData.modifiedHours || []), { start: "08:00", end: "17:00" }];
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  const handleRemoveSlot = (index: number) => {
      const newSlots = (formData.modifiedHours || []).filter((_, i) => i !== index);
      setFormData({ ...formData, modifiedHours: newSlots });
  };

  // Initialize slots when opening logic enabled
  useEffect(() => {
     if (!formData.isClosed && (!formData.modifiedHours || formData.modifiedHours.length === 0)) {
         setFormData(prev => ({ ...prev, modifiedHours: [{ start: "08:00", end: "17:00" }] }));
     }
  }, [formData.isClosed]);

  const eventTypes = [
    { id: 'holiday', label: 'Ngày lễ', icon: PartyPopper, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    { id: 'maintenance', label: 'Bảo trì', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'custom', label: 'Khác', icon: Settings2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-xl">
              {initialData ? "Chỉnh sửa ngoại lệ" : "Thêm ngoại lệ mới"}
          </DialogTitle>
          <div className="text-sm text-muted-foreground pt-1">
             Thiết lập thời gian và chi tiết cho sự kiện.
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">

          <div className="space-y-2">
            <Label className="text-sm font-medium">Thời gian áp dụng</Label>
            <div className="w-full">
                <DateRangePicker
                    date={dateRange}
                    setDate={handleRangeChange}
                />
            </div>
            <p className="text-[11px] text-muted-foreground ml-1">
                Đã chọn {selectedDates.length} ngày
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">Lý do / Tên sự kiện</Label>
            <div className="relative">
              <InputWithIcon
                icon={Sparkles}
                id="reason"
                value={formData.reason || ''}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                placeholder="Ví dụ: Tết Nguyên Đán"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Loại sự kiện</Label>
            <div className="grid grid-cols-3 gap-3">
              {eventTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData({...formData, type: type.id as any})}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all duration-200 hover:bg-muted/50",
                    formData.type === type.id
                      ? `border-${type.color.split('-')[1]} bg-muted`
                      : "border-transparent bg-muted/20"
                  )}
                >
                  <div className={cn("p-2 rounded-full", type.bg)}>
                    <type.icon className={cn("w-5 h-5", type.color)} />
                  </div>
                  <span className="text-xs font-semibold">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
             <div className="flex items-center justify-between">
                <Label htmlFor="closed" className="text-sm font-medium">Trạng thái hoạt động</Label>
             </div>

             <div className="border rounded-2xl p-4 bg-muted/10 space-y-4">
                <div className="flex items-center gap-4">
                    <Switch
                        id="closed"
                        checked={formData.isClosed}
                        onCheckedChange={checked => setFormData({...formData, isClosed: checked})}
                        className="data-[state=checked]:bg-destructive scale-110"
                    />
                    <div className="flex flex-col">
                        <Label htmlFor="closed" className="cursor-pointer text-sm font-bold text-foreground">
                        {formData.isClosed ? "Đóng cửa hoàn toàn" : "Mở cửa (Giờ đặc biệt)"}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                        {formData.isClosed
                            ? "Spa sẽ không nhận lịch hẹn vào ngày này"
                            : "Spa vẫn hoạt động nhưng có thay đổi giờ làm việc"}
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
                            <div className="pt-2 pl-14 space-y-3">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Khung giờ làm việc</Label>
                                <div className="space-y-3">
                                    {(formData.modifiedHours || []).map((slot, index) => (
                                        <div key={index} className="flex items-center gap-2 group/slot">
                                            <div className="flex items-center gap-2 bg-background border p-1 rounded-lg shadow-sm">
                                                <TimePicker
                                                    value={slot.start}
                                                    onChange={val => handleTimeChange(index, 'start', val)}
                                                    className="w-24 border-none shadow-none text-sm h-8"
                                                />
                                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                <TimePicker
                                                    value={slot.end}
                                                    onChange={val => handleTimeChange(index, 'end', val)}
                                                    className="w-24 border-none shadow-none text-sm text-right h-8"
                                                />
                                            </div>
                                            {(formData.modifiedHours?.length || 0) > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveSlot(index)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAddSlot}
                                    className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-3 rounded-full mt-2"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                    Thêm khung giờ
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full h-11 rounded-xl text-base font-medium">
              {initialData ? "Cập nhật thay đổi" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
