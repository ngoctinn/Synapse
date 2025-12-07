
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui/hover-card";
import { ExceptionDate } from "../model/types";
import { Badge } from "@/shared/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { capitalize } from "@/shared/lib/utils";
import { Calendar, Hammer, Palmtree, Clock, Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SmartTooltipProps {
  children: React.ReactNode;
  exception?: ExceptionDate;
  date: Date;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  holiday: { label: "Nghỉ lễ", icon: Palmtree },
  maintenance: { label: "Bảo trì", icon: Hammer },
  custom: { label: "Tùy chỉnh", icon: Calendar },
};

export function SmartTooltip({ children, exception, date }: SmartTooltipProps) {
  if (!exception) {
    return <>{children}</>;
  }

  const isClosed = exception.isClosed;
  const typeConfig = TYPE_CONFIG[exception.type] || TYPE_CONFIG.custom;
  const TypeIcon = typeConfig.icon;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-0 overflow-hidden shadow-xl border-border/50 bg-background/95 backdrop-blur-sm" 
        side="top"
        align="center"
        sideOffset={5}
      >
        {/* Header Strip */}
        <div className={cn(
          "w-full h-1.5",
          isClosed ? "bg-destructive/80" : "bg-primary/80"
        )} />

        <div className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex gap-2.5 items-start">
                    <div className={cn(
                        "p-1.5 rounded-md shrink-0 mt-0.5",
                        isClosed ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                        <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm leading-tight text-foreground text-balance">
                            {exception.reason}
                        </h4>
                        <div className="flex items-center gap-2">
                             <Badge variant={isClosed ? "destructive" : "default"} 
                                   className={cn(
                                       "text-[10px] px-1.5 h-5 font-normal",
                                       !isClosed && "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                                   )}>
                                {isClosed ? "Đóng cửa" : "Giờ đặc biệt"}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 bg-muted rounded-full">
                                {typeConfig.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50" />

            {/* Time Info */}
            <div className="text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium text-foreground">
                        {capitalize(format(date, "EEEE, dd/MM/yyyy", { locale: vi }))}
                    </span>
                </div>
                
                {!isClosed && exception.modifiedHours && exception.modifiedHours.length > 0 ? (
                    <div className="space-y-1.5">
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>Giờ hoạt động:</span>
                        </div>
                        <div className="grid gap-1 pl-[22px]">
                            {exception.modifiedHours.map((slot, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-foreground font-medium bg-muted/30 px-2 py-1 rounded border border-border/50 w-fit">
                                    <span>{slot.start}</span>
                                    <span className="text-muted-foreground/50">➜</span>
                                    <span>{slot.end}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : isClosed ? (
                    <div className="flex items-center gap-2 text-destructive/80 italic">
                        <Info className="w-3.5 h-3.5" />
                        <span>Không nhận lịch hẹn vào ngày này</span>
                    </div>
                ) : null}
            </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
