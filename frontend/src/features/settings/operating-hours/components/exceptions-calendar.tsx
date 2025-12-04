import { useState } from "react";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Badge } from "@/shared/ui/badge";
import { ExceptionDate } from "../model/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Plus, Trash2, CalendarDays, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

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

  const handleAdd = () => {
    if (dates && dates.length > 0 && newException.reason) {
      const exceptionsToAdd: ExceptionDate[] = dates.map(date => ({
        id: Math.random().toString(36).substr(2, 9),
        date: date,
        reason: newException.reason!,
        type: newException.type as 'holiday' | 'custom' | 'maintenance',
        isClosed: newException.isClosed || false,
      }));
      
      onAddExceptions(exceptionsToAdd);
      setIsDialogOpen(false);
      setNewException({ type: 'holiday', isClosed: true, reason: '' });
      setDates([]);
    }
  };

  // Highlight modifiers for calendar
  const modifiers = {
    holiday: exceptions.filter(e => e.type === 'holiday').map(e => e.date),
    custom: exceptions.filter(e => e.type === 'custom').map(e => e.date),
    maintenance: exceptions.filter(e => e.type === 'maintenance').map(e => e.date),
  };

  const modifiersStyles = {
    holiday: { color: 'var(--destructive)', fontWeight: 'bold' },
    custom: { color: 'var(--primary)', fontWeight: 'bold' },
    maintenance: { color: 'var(--warning)', fontWeight: 'bold' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 lg:col-span-4">
        <Card className="h-full border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-6">
             <div className="border rounded-3xl p-6 bg-card/50 backdrop-blur-md shadow-xl ring-1 ring-white/20 dark:ring-white/5">
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <DialogContent className="sm:max-w-[450px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Thêm ngoại lệ mới</DialogTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">Loại sự kiện</Label>
                    <Select 
                      value={newException.type} 
                      onValueChange={(val: 'holiday' | 'custom' | 'maintenance') => setNewException({...newException, type: val})}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="holiday">Ngày lễ</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                        <SelectItem value="custom">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closed" className="text-sm font-medium">Trạng thái</Label>
                    <div className="flex items-center gap-3 h-11 px-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <Switch 
                        id="closed" 
                        checked={newException.isClosed}
                        onCheckedChange={checked => setNewException({...newException, isClosed: checked})}
                        className="data-[state=checked]:bg-destructive"
                      />
                      <Label htmlFor="closed" className="cursor-pointer text-sm font-medium flex-1">
                        {newException.isClosed ? "Đóng cửa" : "Mở cửa"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full h-11 rounded-xl text-base font-medium">Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
          {exceptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-3xl text-muted-foreground bg-muted/5 relative overflow-hidden group">
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
            </div>
          ) : (
            exceptions.sort((a, b) => a.date.getTime() - b.date.getTime()).map((ex) => (
              <div key={ex.id} className="group relative flex items-center justify-between p-4 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2",
                  ex.type === 'holiday' ? "bg-destructive" : ex.type === 'maintenance' ? "bg-amber-500" : "bg-primary"
                )} />
                
                <div className="flex items-center gap-5 pl-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                    ex.type === 'holiday' ? "bg-destructive/5 border-destructive/10 text-destructive" : 
                    ex.type === 'maintenance' ? "bg-amber-500/5 border-amber-500/10 text-amber-600" :
                    "bg-primary/5 border-primary/10 text-primary"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{format(ex.date, 'MMM', { locale: vi })}</span>
                    <span className="text-2xl font-black leading-none tracking-tighter">{format(ex.date, 'dd')}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{ex.reason}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn(
                        "text-[10px] px-2 py-0.5 h-5 font-bold border-0 uppercase tracking-wide",
                        ex.type === 'holiday' ? "bg-destructive/10 text-destructive" : 
                        ex.type === 'maintenance' ? "bg-amber-500/10 text-amber-600" :
                        "bg-primary/10 text-primary"
                      )}>
                        {ex.type === 'holiday' ? 'Ngày lễ' : ex.type === 'maintenance' ? 'Bảo trì' : 'Tùy chỉnh'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                        {ex.isClosed ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                            <span className="text-destructive/80">Đóng cửa cả ngày</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span className="text-primary/80">Giờ làm việc đặc biệt</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemoveException(ex.id)} 
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xóa ngoại lệ này</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
