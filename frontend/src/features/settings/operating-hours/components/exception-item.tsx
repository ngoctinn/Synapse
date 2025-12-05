"use client";

import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2, AlertCircle, Clock, Pencil, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { ExceptionDate } from "../model/types";

interface ExceptionItemProps {
  exceptions: ExceptionDate[];
  onRemove: (id: string) => void;
  onEdit: (exception: ExceptionDate) => void;
}

export function ExceptionItem({ exceptions, onRemove, onEdit }: ExceptionItemProps) {
  const mainException = exceptions[0];
  const isHoliday = mainException.type === 'holiday';
  const isMaintenance = mainException.type === 'maintenance';
  
  // Màu sắc dựa trên loại sự kiện
  const colorStyles = isHoliday 
    ? { border: "bg-destructive", bg: "bg-gradient-to-br from-destructive/5 to-destructive/20", text: "text-destructive", badge: "bg-destructive/10 text-destructive" }
    : isMaintenance
    ? { border: "bg-amber-500", bg: "bg-gradient-to-br from-amber-500/5 to-amber-500/20", text: "text-amber-600", badge: "bg-amber-500/10 text-amber-600" }
    : { border: "bg-primary", bg: "bg-gradient-to-br from-primary/5 to-primary/20", text: "text-primary", badge: "bg-primary/10 text-primary" };

  // Sắp xếp ngày tăng dần
  const sortedDates = [...exceptions].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Check if dates are consecutive
  const isConsecutive = sortedDates.length > 1 && sortedDates.every((date, i) => {
      if (i === 0) return true;
      const prev = sortedDates[i - 1];
      return differenceInDays(date.date, prev.date) === 1;
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-start justify-between p-4 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2",
        colorStyles.border
      )} />
      
      <div className="flex items-start gap-5 pl-4 flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0 relative",
                colorStyles.bg,
                colorStyles.text.replace("text-", "border-") + "/10"
              )}>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider opacity-80", colorStyles.text)}>
                  {format(mainException.date, 'MMM', { locale: vi })}
                </span>
                <span className={cn("text-2xl font-black leading-none tracking-tighter", colorStyles.text)}>
                   {isConsecutive 
                      ? `${format(sortedDates[0].date, 'dd')}-${format(sortedDates[sortedDates.length - 1].date, 'dd')}`
                      : format(mainException.date, 'dd')
                   }
                </span>
                
                {!isConsecutive && sortedDates.length > 1 && (
                  <div className="absolute -top-2 -right-2">
                     <Badge className={cn("h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full border-2 border-background", colorStyles.border)}>
                        +{sortedDates.length - 1}
                     </Badge>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs font-medium">
                {sortedDates.map(d => format(d.date, 'dd/MM/yyyy')).join(', ')}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {mainException.reason}
            </h4>
            <Badge variant="secondary" className={cn(
              "text-[10px] px-2 py-0.5 h-5 font-bold border-0 uppercase tracking-wide",
              colorStyles.badge
            )}>
              {isHoliday ? 'Ngày lễ' : isMaintenance ? 'Bảo trì' : 'Tùy chỉnh'}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {sortedDates.map((ex, index) => (
               <Badge key={index} variant="outline" className="bg-background/50 text-xs font-normal">
                 {format(ex.date, 'dd/MM/yyyy')}
               </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              {mainException.isClosed ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-destructive/80">Đóng cửa cả ngày</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary/80">
                    Giờ đặc biệt: {mainException.modifiedHours?.map(h => `${h.start}-${h.end}`).join(', ') || '08:00-17:00'}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 pl-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(mainException)} 
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10"
              >
                <Pencil className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chỉnh sửa</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemove(mainException.id)} 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa ngoại lệ này</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}


