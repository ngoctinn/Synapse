import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { ExceptionDate } from "../model/types";

interface ExceptionItemProps {
  exception: ExceptionDate;
  dateCount?: number; // Số lượng ngày trong nhóm (nếu có)
  onRemove: (id: string) => void;
}

export function ExceptionItem({ exception, dateCount = 1, onRemove }: ExceptionItemProps) {
  const isHoliday = exception.type === 'holiday';
  const isMaintenance = exception.type === 'maintenance';
  
  // Màu sắc dựa trên loại sự kiện
  const colorStyles = isHoliday 
    ? { border: "bg-destructive", bg: "bg-destructive/5", text: "text-destructive", badge: "bg-destructive/10 text-destructive" }
    : isMaintenance
    ? { border: "bg-amber-500", bg: "bg-amber-500/5", text: "text-amber-600", badge: "bg-amber-500/10 text-amber-600" }
    : { border: "bg-primary", bg: "bg-primary/5", text: "text-primary", badge: "bg-primary/10 text-primary" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center justify-between p-4 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 overflow-hidden mb-3"
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2",
        colorStyles.border
      )} />
      
      <div className="flex items-center gap-5 pl-4">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          colorStyles.bg,
          colorStyles.text.replace("text-", "border-") + "/10"
        )}>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider opacity-80", colorStyles.text)}>
            {format(exception.date, 'MMM', { locale: vi })}
          </span>
          <span className={cn("text-2xl font-black leading-none tracking-tighter", colorStyles.text)}>
            {format(exception.date, 'dd')}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {exception.reason}
            </h4>
            {dateCount > 1 && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background">
                +{dateCount - 1} ngày khác
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn(
              "text-[10px] px-2 py-0.5 h-5 font-bold border-0 uppercase tracking-wide",
              colorStyles.badge
            )}>
              {isHoliday ? 'Ngày lễ' : isMaintenance ? 'Bảo trì' : 'Tùy chỉnh'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              {exception.isClosed ? (
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
              onClick={() => onRemove(exception.id)} 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xóa ngoại lệ này</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}
