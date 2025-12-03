import { useState } from "react";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { ExceptionDate } from "../model/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ExceptionsCalendarProps {
  exceptions: ExceptionDate[];
  onAddException: (exception: ExceptionDate) => void;
  onRemoveException: (id: string) => void;
}

export function ExceptionsCalendar({ exceptions, onAddException, onRemoveException }: ExceptionsCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newException, setNewException] = useState<Partial<ExceptionDate>>({
    type: 'holiday',
    isClosed: true,
  });

  const handleAdd = () => {
    if (date && newException.reason) {
      onAddException({
        id: Math.random().toString(36).substr(2, 9),
        date: date,
        reason: newException.reason,
        type: newException.type as any,
        isClosed: newException.isClosed || false,
      });
      setIsDialogOpen(false);
      setNewException({ type: 'holiday', isClosed: true, reason: '' });
    }
  };

  // Highlight modifiers for calendar
  const modifiers = {
    holiday: exceptions.filter(e => e.type === 'holiday').map(e => e.date),
    custom: exceptions.filter(e => e.type === 'custom').map(e => e.date),
  };

  const modifiersStyles = {
    holiday: { color: 'var(--destructive)', fontWeight: 'bold' },
    custom: { color: 'var(--primary)', fontWeight: 'bold' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 lg:col-span-4">
        <Card className="h-full border-none shadow-none bg-transparent">
          <CardContent className="p-0">
             <div className="border rounded-xl p-4 bg-card shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md w-full flex justify-center"
                locale={vi}
              />
            </div>
            <div className="mt-4 flex gap-4 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Ngày lễ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Tùy chỉnh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Danh sách ngày nghỉ & Ngoại lệ
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => date && setIsDialogOpen(true)} disabled={!date}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngoại lệ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm ngoại lệ cho ngày {date ? format(date, 'dd/MM/yyyy') : ''}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">Lý do</Label>
                  <Input 
                    id="reason" 
                    value={newException.reason || ''} 
                    onChange={e => setNewException({...newException, reason: e.target.value})}
                    className="col-span-3" 
                    placeholder="Ví dụ: Tết Nguyên Đán"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Loại</Label>
                  <Select 
                    value={newException.type} 
                    onValueChange={(val: any) => setNewException({...newException, type: val})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">Ngày lễ</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="custom">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="closed" className="text-right">Đóng cửa?</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Switch 
                      id="closed" 
                      checked={newException.isClosed}
                      onCheckedChange={checked => setNewException({...newException, isClosed: checked})}
                    />
                    <span className="text-sm text-muted-foreground">
                      {newException.isClosed ? "Spa sẽ đóng cửa cả ngày" : "Chỉ thay đổi giờ làm việc"}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {exceptions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
              Chưa có ngày ngoại lệ nào được cấu hình.
            </div>
          ) : (
            exceptions.sort((a, b) => a.date.getTime() - b.date.getTime()).map((ex) => (
              <div key={ex.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex flex-col items-center justify-center border",
                    ex.type === 'holiday' ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"
                  )}>
                    <span className="text-xs font-bold uppercase">{format(ex.date, 'MMM', { locale: vi })}</span>
                    <span className="text-lg font-bold">{format(ex.date, 'dd')}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{ex.reason}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{ex.type === 'holiday' ? 'Ngày lễ' : 'Tùy chỉnh'} • {ex.isClosed ? 'Đóng cửa' : 'Giờ đặc biệt'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveException(ex.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
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
