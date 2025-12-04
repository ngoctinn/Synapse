"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Calendar, CalendarDayButton } from "@/shared/ui/calendar";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { ExceptionDate } from "../model/types";
import { vi } from "date-fns/locale";
import { Plus, CalendarDays, ArrowLeft, PartyPopper, Wrench, Settings2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { ExceptionItem } from "./exception-item";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface ExceptionsCalendarProps {
  exceptions: ExceptionDate[];
  onAddExceptions: (exceptions: ExceptionDate[]) => void;
  onRemoveException: (id: string) => void;
}

export function ExceptionsCalendar({ exceptions, onAddExceptions, onRemoveException }: ExceptionsCalendarProps) {
  const [dates, setDates] = useState<Date[] | undefined>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newException, setNewException] = useState<Partial<ExceptionDate>>({
    type: 'holiday',
    isClosed: true,
  });
  const [editingException, setEditingException] = useState<ExceptionDate | null>(null);

  // Drag selection state
  const isDragging = useRef(false);
  const dragAction = useRef<'select' | 'deselect'>('select');

  const handleAdd = () => {
    if (dates && dates.length > 0 && newException.reason) {
      // Nếu đang edit, xóa cái cũ đi trước
      if (editingException) {
        onRemoveException(editingException.id);
      }

      // Tạo một ID chung cho nhóm ngoại lệ này để dễ dàng gom nhóm hiển thị
      const groupId = editingException ? editingException.id : crypto.randomUUID();
      
      const exceptionsToAdd: ExceptionDate[] = dates.map(date => ({
        id: groupId, // Sử dụng chung ID cho cả nhóm
        date: date,
        reason: newException.reason!,
        type: newException.type as 'holiday' | 'custom' | 'maintenance',
        isClosed: newException.isClosed || false,
      }));
      
      onAddExceptions(exceptionsToAdd);
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingException ? "Đã cập nhật ngoại lệ" : "Đã thêm ngoại lệ mới");
    }
  };

  const resetForm = () => {
    setNewException({ type: 'holiday', isClosed: true, reason: '' });
    setDates([]);
    setEditingException(null);
  };

  const handleEdit = (exception: ExceptionDate) => {
    // Tìm tất cả các ngày thuộc nhóm ngoại lệ này
    const groupDates = exceptions
      .filter(e => e.id === exception.id)
      .map(e => e.date);
    
    setDates(groupDates);
    setNewException({
      reason: exception.reason,
      type: exception.type,
      isClosed: exception.isClosed,
    });
    setEditingException(exception);
    setIsDialogOpen(true);
  };

  // Highlight modifiers for calendar
  const modifiers = useMemo(() => ({
    holiday: exceptions.filter(e => e.type === 'holiday').map(e => e.date),
    custom: exceptions.filter(e => e.type === 'custom').map(e => e.date),
    maintenance: exceptions.filter(e => e.type === 'maintenance').map(e => e.date),
  }), [exceptions]);

  const modifiersStyles = useMemo(() => ({
    holiday: { color: 'var(--destructive)', fontWeight: 'bold' },
    custom: { color: 'var(--primary)', fontWeight: 'bold' },
    maintenance: { color: 'var(--warning)', fontWeight: 'bold' },
  }), []);

  // Gom nhóm các ngoại lệ theo ID để hiển thị gọn gàng
  const groupedExceptions = useMemo(() => {
    const groups = new Map<string, ExceptionDate[]>();
    
    // Sắp xếp theo ngày trước
    const sortedExceptions = [...exceptions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sortedExceptions.forEach(ex => {
      const existing = groups.get(ex.id);
      if (existing) {
        existing.push(ex);
      } else {
        groups.set(ex.id, [ex]);
      }
    });
    
    return Array.from(groups.values());
  }, [exceptions]);

  const handleDayDoubleClick = (day: Date) => {
    // Đảm bảo ngày được chọn khi double click
    setDates(prev => {
      const isSelected = prev?.some(d => d.getTime() === day.getTime());
      if (!isSelected) {
        return [...(prev || []), day];
      }
      return prev;
    });
    // Reset form nếu không phải đang edit
    if (!editingException) {
        setNewException(prev => ({ ...prev, reason: '' }));
    }
    setIsDialogOpen(true);
  };

  // Drag Handlers
  const handleMouseDown = useCallback((day: Date) => {
    isDragging.current = true;
    
    // Determine action based on whether the clicked day is already selected
    const isSelected = dates?.some(d => d.getTime() === day.getTime());
    dragAction.current = isSelected ? 'deselect' : 'select';

    setDates(prev => {
      if (dragAction.current === 'select') {
        return [...(prev || []), day];
      } else {
        return prev?.filter(d => d.getTime() !== day.getTime());
      }
    });
  }, [dates]);

  const handleMouseEnter = useCallback((day: Date) => {
    if (!isDragging.current) return;

    setDates(prev => {
      const isSelected = prev?.some(d => d.getTime() === day.getTime());
      
      if (dragAction.current === 'select' && !isSelected) {
        return [...(prev || []), day];
      } else if (dragAction.current === 'deselect' && isSelected) {
        return prev?.filter(d => d.getTime() !== day.getTime());
      }
      return prev;
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Global mouse up to catch drags that end outside the calendar
  useMemo(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseUp]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 lg:col-span-4">
        <Card className="h-full border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-6">
             <div className="border rounded-3xl p-6 bg-card/50 backdrop-blur-md shadow-xl ring-1 ring-white/20 dark:ring-white/5 select-none">
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={setDates}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md w-full flex justify-center p-2"
                locale={vi}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                  day_today: "bg-accent text-accent-foreground rounded-full",
                }}
                components={{
                  DayButton: (props: any) => (
                    <CalendarDayButton
                      {...props}
                      onDoubleClick={() => handleDayDoubleClick(props.day.date)}
                      onMouseDown={() => handleMouseDown(props.day.date)}
                      onMouseEnter={() => handleMouseEnter(props.day.date)}
                    />
                  )
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-destructive font-medium text-xs">Ngày lễ</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-medium text-xs">Tùy chỉnh</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-600 font-medium text-xs">Bảo trì</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
              <CalendarDays className="w-5 h-5 text-primary" />
              Danh sách Ngoại lệ
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Quản lý các ngày nghỉ lễ và lịch làm việc đặc biệt</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => dates && dates.length > 0 && setIsDialogOpen(true)} 
                      disabled={!dates || dates.length === 0} 
                      className={cn(
                        "shadow-lg transition-all duration-300",
                        dates && dates.length > 0 ? "animate-bounce-subtle" : "opacity-50"
                      )}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm ngoại lệ ({dates?.length || 0})
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Thêm ngoại lệ cho các ngày đã chọn</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">
                    {editingException ? "Chỉnh sửa ngoại lệ" : "Thêm ngoại lệ mới"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Đang thiết lập cho <span className="font-bold text-foreground">{dates?.length}</span> ngày đã chọn.
                </p>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium">Lý do / Tên sự kiện</Label>
                  <Input 
                    id="reason" 
                    value={newException.reason || ''} 
                    onChange={e => setNewException({...newException, reason: e.target.value})}
                    placeholder="Ví dụ: Tết Nguyên Đán"
                    className="h-11 rounded-xl" 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Loại sự kiện</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'holiday', label: 'Ngày lễ', icon: PartyPopper, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
                      { id: 'maintenance', label: 'Bảo trì', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                      { id: 'custom', label: 'Khác', icon: Settings2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
                    ].map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => setNewException({...newException, type: type.id as any})}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all duration-200 hover:bg-muted/50",
                          newException.type === type.id 
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
                      checked={newException.isClosed}
                      onCheckedChange={checked => setNewException({...newException, isClosed: checked})}
                      className="data-[state=checked]:bg-destructive"
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="closed" className="cursor-pointer text-sm font-bold">
                        {newException.isClosed ? "Đóng cửa hoàn toàn" : "Mở cửa (Giờ đặc biệt)"}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {newException.isClosed 
                          ? "Spa sẽ không nhận lịch hẹn vào ngày này" 
                          : "Spa vẫn hoạt động nhưng có thể thay đổi giờ làm việc"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full h-11 rounded-xl text-base font-medium">
                    {editingException ? "Cập nhật thay đổi" : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {groupedExceptions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-3xl text-muted-foreground bg-muted/5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 opacity-50" />
                <div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 shadow-inner ring-4 ring-background">
                    <CalendarDays className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Chưa có ngày ngoại lệ</h3>
                  <p className="text-sm text-muted-foreground max-w-xs text-center leading-relaxed">
                    Chọn ngày trên lịch để thêm ngày nghỉ lễ, bảo trì hoặc giờ làm việc đặc biệt.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-primary text-sm font-medium bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <ArrowLeft className="w-4 h-4 animate-pulse-horizontal" />
                    <span>Bắt đầu bằng việc chọn ngày</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              groupedExceptions.map((group) => (
                <ExceptionItem 
                  key={group[0].id} 
                  exception={group[0]} 
                  dateCount={group.length}
                  onRemove={onRemoveException}
                  onEdit={handleEdit}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

