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
import { Plus, CalendarDays, ArrowLeft, PartyPopper, Wrench, Settings2, Filter, Type, Tag } from "lucide-react";
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
  const [filterType, setFilterType] = useState<'all' | 'holiday' | 'custom' | 'maintenance'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'closed' | 'open'>('all');

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

  const modifiersClassNames = {
    holiday: "text-destructive font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-destructive after:rounded-full",
    custom: "text-primary font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
    maintenance: "text-amber-600 font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-amber-600 after:rounded-full",
  };

  // Gom nhóm các ngoại lệ theo ID để hiển thị gọn gàng
  const groupedExceptions = useMemo(() => {
    const groups = new Map<string, ExceptionDate[]>();
    
    // Filter before grouping
    const filteredExceptions = exceptions.filter(ex => {
      const typeMatch = filterType === 'all' ? true : ex.type === filterType;
      const statusMatch = statusFilter === 'all' ? true :
                          statusFilter === 'closed' ? ex.isClosed :
                          !ex.isClosed;
      return typeMatch && statusMatch;
    });

    // Sắp xếp theo ngày trước
    const sortedExceptions = [...filteredExceptions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sortedExceptions.forEach(ex => {
      const existing = groups.get(ex.id);
      if (existing) {
        existing.push(ex);
      } else {
        groups.set(ex.id, [ex]);
      }
    });
    
    return Array.from(groups.values());
  }, [exceptions, filterType, statusFilter]);

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
             <div className="border rounded-3xl p-6 bg-card/50 backdrop-blur-md shadow-xl ring-1 ring-white/20 dark:ring-white/5 select-none shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={setDates}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
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
                          "w-full shadow-lg transition-all duration-300 h-12 text-base rounded-xl",
                          dates && dates.length > 0 ? "animate-bounce-subtle" : "opacity-50"
                        )}
                      >
                        <Plus className="w-5 h-5 mr-2" />
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
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="reason" 
                        value={newException.reason || ''} 
                        onChange={e => setNewException({...newException, reason: e.target.value})}
                        placeholder="Ví dụ: Tết Nguyên Đán"
                        className="h-11 rounded-xl pl-9" 
                      />
                    </div>
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
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border/40 gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
              <CalendarDays className="w-5 h-5 text-primary" />
              Danh sách các ngày đặc biệt
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Quản lý các ngày nghỉ lễ và lịch làm việc đặc biệt</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end text-sm items-center w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                  statusFilter === 'all' 
                    ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                  statusFilter === 'closed' 
                    ? "bg-destructive/10 text-destructive shadow-sm ring-1 ring-destructive/20" 
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full bg-destructive", statusFilter === 'closed' && "animate-pulse")} />
                Đóng cửa
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                  statusFilter === 'open' 
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full bg-primary", statusFilter === 'open' && "animate-pulse")} />
                Mở cửa
              </button>
            </div>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            <button
              onClick={() => setFilterType(filterType === 'holiday' ? 'all' : 'holiday')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200",
                filterType === 'holiday' 
                  ? "bg-destructive/20 border-destructive ring-1 ring-destructive/30" 
                  : "bg-destructive/10 border-destructive/20 hover:bg-destructive/15",
                 filterType !== 'all' && filterType !== 'holiday' && "opacity-40 grayscale"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-destructive font-medium text-xs">Ngày lễ</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'custom' ? 'all' : 'custom')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200",
                filterType === 'custom' 
                  ? "bg-primary/20 border-primary ring-1 ring-primary/30" 
                  : "bg-primary/10 border-primary/20 hover:bg-primary/15",
                 filterType !== 'all' && filterType !== 'custom' && "opacity-40 grayscale"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-medium text-xs">Tùy chỉnh</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'maintenance' ? 'all' : 'maintenance')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200",
                filterType === 'maintenance' 
                  ? "bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/30" 
                  : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15",
                 filterType !== 'all' && filterType !== 'maintenance' && "opacity-40 grayscale"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-600 font-medium text-xs">Bảo trì</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {groupedExceptions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-3xl text-muted-foreground bg-muted/5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 opacity-50 animate-pulse" />
                <div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 shadow-inner ring-4 ring-background">
                    <CalendarDays className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Chưa có ngày ngoại lệ</h3>
                  <p className="text-sm text-muted-foreground max-w-xs text-center leading-relaxed">
                    {filterType !== 'all' || statusFilter !== 'all' 
                      ? "Không tìm thấy ngoại lệ phù hợp với bộ lọc hiện tại."
                      : "Chọn ngày trên lịch để thêm ngày nghỉ lễ, bảo trì hoặc giờ làm việc đặc biệt."}
                  </p>
                  {(filterType !== 'all' || statusFilter !== 'all') && (
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setFilterType('all');
                        setStatusFilter('all');
                      }}
                      className="mt-2 text-primary"
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                  {filterType === 'all' && statusFilter === 'all' && (
                    <div className="mt-8 flex items-center gap-2 text-primary text-sm font-medium bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                      <ArrowLeft className="w-4 h-4 animate-pulse-horizontal" />
                      <span>Bắt đầu bằng việc chọn ngày</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              groupedExceptions.map((group) => (
                <ExceptionItem 
                  key={group[0].id} 
                  exceptions={group} 
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

