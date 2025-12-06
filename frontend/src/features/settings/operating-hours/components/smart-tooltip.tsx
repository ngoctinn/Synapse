
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui/hover-card";
import { ExceptionDate } from "../model/types";
import { Badge } from "@/shared/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { capitalize } from "@/shared/lib/utils";

interface SmartTooltipProps {
  children: React.ReactNode;
  exception?: ExceptionDate;
  date: Date;
}

export function SmartTooltip({ children, exception, date }: SmartTooltipProps) {
  if (!exception) {
    return <>{children}</>;
  }

  const isClosed = exception.isClosed;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-64 p-4 z-50 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm" 
        side="top"
        align="center"
      >
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm leading-tight text-foreground/90">
                    {exception.reason}
                </h4>
                <Badge variant={isClosed ? "destructive" : "default"} className="text-[10px] h-5 px-1.5 shrink-0">
                    {isClosed ? "Đóng cửa" : "Giờ đặc biệt"}
                </Badge>
            </div>

            {/* Time Info */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p>
                    <span className="font-medium text-foreground">Ngày: </span> 
                    {capitalize(format(date, "EEEE, dd/MM/yyyy", { locale: vi }))}
                </p>
                
                {!isClosed && exception.modifiedHours && exception.modifiedHours.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1">
                        <span className="font-medium text-foreground">Giờ hoạt động:</span>
                        {exception.modifiedHours.map((slot, idx) => (
                            <span key={idx} className="block pl-2 border-l-2 border-primary/20">
                                {slot.start} - {slot.end}
                            </span>
                        ))}
                    </div>
                )}
                 
                 {/* Type Badge if needed */}
                 <div className="pt-2 flex gap-1">
                     <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground border-border/50">
                        {exception.type === 'holiday' ? 'Nghỉ lễ' : exception.type === 'maintenance' ? 'Bảo trì' : 'Tùy chỉnh'}
                     </Badge>
                 </div>
            </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
