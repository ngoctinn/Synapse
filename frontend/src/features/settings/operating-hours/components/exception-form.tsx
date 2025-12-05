"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { ExceptionDate } from "../model/types";
import { PartyPopper, Wrench, Settings2, Type } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ExceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ExceptionDate>) => void;
  initialData?: ExceptionDate | null;
  selectedDatesCount: number;
}

export function ExceptionForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  selectedDatesCount 
}: ExceptionFormProps) {
  const [formData, setFormData] = useState<Partial<ExceptionDate>>({
    type: 'holiday',
    isClosed: true,
    reason: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          reason: initialData.reason,
          type: initialData.type,
          isClosed: initialData.isClosed,
        });
      } else {
        setFormData({ type: 'holiday', isClosed: true, reason: '' });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (formData.reason) {
      onSubmit(formData);
    }
  };

  const eventTypes = [
    { id: 'holiday', label: 'Ngày lễ', icon: PartyPopper, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    { id: 'maintenance', label: 'Bảo trì', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'custom', label: 'Khác', icon: Settings2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
              {initialData ? "Chỉnh sửa ngoại lệ" : "Thêm ngoại lệ mới"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Đang thiết lập cho <span className="font-bold text-foreground">{selectedDatesCount}</span> ngày đã chọn.
          </p>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">Lý do / Tên sự kiện</Label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="reason" 
                value={formData.reason || ''} 
                onChange={e => setFormData({...formData, reason: e.target.value})}
                placeholder="Ví dụ: Tết Nguyên Đán"
                className="h-11 rounded-xl pl-9" 
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

          <div className="space-y-2">
            <Label htmlFor="closed" className="text-sm font-medium">Trạng thái hoạt động</Label>
            <div className="flex items-center gap-3 h-14 px-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
              <Switch 
                id="closed" 
                checked={formData.isClosed}
                onCheckedChange={checked => setFormData({...formData, isClosed: checked})}
                className="data-[state=checked]:bg-destructive"
              />
              <div className="flex flex-col">
                <Label htmlFor="closed" className="cursor-pointer text-sm font-bold">
                  {formData.isClosed ? "Đóng cửa hoàn toàn" : "Mở cửa (Giờ đặc biệt)"}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {formData.isClosed 
                    ? "Spa sẽ không nhận lịch hẹn vào ngày này" 
                    : "Spa vẫn hoạt động nhưng có thể thay đổi giờ làm việc"}
                </span>
              </div>
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
