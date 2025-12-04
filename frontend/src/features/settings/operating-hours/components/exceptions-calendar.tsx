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
          <CardContent className="p-0 space-y-4">
             <div className="border rounded-2xl p-6 bg-card/80 backdrop-blur-sm shadow-lg">
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={setDates}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md w-full flex justify-center"
                locale={vi}
              />
            </div>
            <div className="flex gap-4 justify-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Ngày lễ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Tùy chỉnh</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Bảo trì</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Danh sách Ngoại lệ
            </h3>
            <p className="text-sm text-muted-foreground">Quản lý các ngày nghỉ lễ và lịch làm việc đặc biệt</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => dates && dates.length > 0 && setIsDialogOpen(true)} disabled={!dates || dates.length === 0} className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngoại lệ ({dates?.length || 0})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm ngoại lệ cho {dates?.length} ngày đã chọn</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do / Tên sự kiện</Label>
                  <Input 
                    id="reason" 
                    value={newException.reason || ''} 
                    onChange={e => setNewException({...newException, reason: e.target.value})}
                    placeholder="Ví dụ: Tết Nguyên Đán"
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại sự kiện</Label>
                    <Select 
                      value={newException.type} 
                      onValueChange={(val: 'holiday' | 'custom' | 'maintenance') => setNewException({...newException, type: val})}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="closed">Trạng thái</Label>
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/20">
                      <Switch 
                        id="closed" 
                        checked={newException.isClosed}
                        onCheckedChange={checked => setNewException({...newException, isClosed: checked})}
                      />
                      <Label htmlFor="closed" className="cursor-pointer text-sm font-normal">
                        {newException.isClosed ? "Đóng cửa" : "Mở cửa"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full">Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {exceptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 shadow-sm">
                  <CalendarDays className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-lg">Chưa có ngày ngoại lệ nào</p>
                <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
                  Chọn một hoặc nhiều ngày trên lịch bên trái để thiết lập ngày nghỉ hoặc giờ làm việc đặc biệt.
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium animate-pulse">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Chọn ngày trên lịch</span>
                </div>
              </div>
            </div>
          ) : (
            exceptions.sort((a, b) => a.date.getTime() - b.date.getTime()).map((ex) => (
              <div key={ex.id} className="group relative flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  ex.type === 'holiday' ? "bg-destructive" : ex.type === 'maintenance' ? "bg-amber-500" : "bg-primary"
                )} />
                
                <div className="flex items-center gap-4 pl-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex flex-col items-center justify-center border shadow-sm",
                    ex.type === 'holiday' ? "bg-destructive/5 border-destructive/10 text-destructive" : 
                    ex.type === 'maintenance' ? "bg-amber-500/5 border-amber-500/10 text-amber-600" :
                    "bg-primary/5 border-primary/10 text-primary"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{format(ex.date, 'MMM', { locale: vi })}</span>
                    <span className="text-xl font-bold leading-none">{format(ex.date, 'dd')}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{ex.reason}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={cn(
                        "text-[10px] px-1.5 py-0 h-5 font-medium border-0",
                        ex.type === 'holiday' ? "bg-destructive/10 text-destructive" : 
                        ex.type === 'maintenance' ? "bg-amber-500/10 text-amber-600" :
                        "bg-primary/10 text-primary"
                      )}>
                        {ex.type === 'holiday' ? 'Ngày lễ' : ex.type === 'maintenance' ? 'Bảo trì' : 'Tùy chỉnh'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {ex.isClosed ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Đóng cửa cả ngày
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Giờ làm việc đặc biệt
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveException(ex.id)} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
