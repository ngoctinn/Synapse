"use client";

import { differenceInMinutes, format, setHours, setMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import * as React from "react";

import { Appointment } from "@/features/customer-dashboard";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface TimelineConfig {
  startHour: number;
  endHour: number;
  step: number;
}

interface AppointmentTimelineProps {
  appointments: Appointment[];
  config?: Partial<TimelineConfig>;
  onSlotClick?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const DEFAULT_CONFIG: TimelineConfig = { startHour: 8, endHour: 20, step: 15 };

const roundToNearestStep = (date: Date, step: number) => {
  const minutes = date.getMinutes();
  const rounded = Math.round(minutes / step) * step;
  return setMinutes(date, rounded);
};

const statusMap: Record<
  string,
  { label: string; className: string; bgClass: string; borderClass: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "text-[var(--status-pending-foreground)]",
    bgClass: "bg-[var(--status-pending)]/20",
    borderClass: "border-[var(--status-pending-border)]",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "text-[var(--status-confirmed-foreground)]",
    bgClass: "bg-[var(--status-confirmed)]/20",
    borderClass: "border-[var(--status-confirmed-border)]",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "text-[var(--status-completed-foreground)]",
    bgClass: "bg-[var(--status-completed)]/20",
    borderClass: "border-[var(--status-completed-border)]",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "text-[var(--status-cancelled-foreground)]",
    bgClass: "bg-[var(--status-cancelled)]/20",
    borderClass: "border-[var(--status-cancelled-border)]",
  },
  NO_SHOW: {
    label: "Vắng mặt",
    className: "text-[var(--status-noshow-foreground)]",
    bgClass: "bg-[var(--status-noshow)]/20",
    borderClass: "border-[var(--status-noshow-border)]",
  },
};

interface LayoutItem extends Appointment {
  top: number;
  height: number;
  left: number;
  width: number;
  startMinutes: number;
  endMinutes: number;
}

const calculateLayout = (
  appointments: Appointment[],
  startHour: number,
  endHour: number
): LayoutItem[] => {
  const totalMinutes = (endHour - startHour) * 60;
  const sorted = [...appointments].sort((a, b) => {
    const diff =
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    if (diff !== 0) return diff;
    return b.durationMinutes - a.durationMinutes;
  });

  const items = sorted.map((app) => {
    const date = new Date(app.startTime);
    const startOfDayTime = setMinutes(setHours(date, startHour), 0);
    const minutesFromStart = differenceInMinutes(date, startOfDayTime);
    const top = Math.max(0, (minutesFromStart / totalMinutes) * 100);
    const height = Math.min(
      100 - top,
      (app.durationMinutes / totalMinutes) * 100
    );
    return {
      ...app,
      top,
      height,
      left: 0,
      width: 100,
      startMinutes: minutesFromStart,
      endMinutes: minutesFromStart + app.durationMinutes,
    };
  });

  const columns: LayoutItem[][] = [];
  items.forEach((item) => {
    let placed = false;
    for (const column of columns) {
      const isOverlapping = column.some(
        (existing) =>
          item.startMinutes < existing.endMinutes &&
          item.endMinutes > existing.startMinutes
      );
      if (!isOverlapping) {
        column.push(item);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([item]);
  });

  const result: LayoutItem[] = [];
  columns.forEach((col, colIndex) => {
    col.forEach((item) => {
      item.left = (colIndex / columns.length) * 100;
      item.width = (1 / columns.length) * 100;
      result.push(item);
    });
  });
  return result;
};

export function AppointmentTimeline({
  appointments,
  config = {},
  onSlotClick,
  onAppointmentClick,
}: AppointmentTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const finalConfig = React.useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [hoverTime, setHoverTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const layoutItems = React.useMemo(
    () =>
      calculateLayout(appointments, finalConfig.startHour, finalConfig.endHour),
    [appointments, finalConfig.startHour, finalConfig.endHour]
  );

  const currentTimeStyle = React.useMemo(() => {
    const totalMinutes = (finalConfig.endHour - finalConfig.startHour) * 60;
    const startOfDayTime = setMinutes(
      setHours(currentTime, finalConfig.startHour),
      0
    );
    const minutesFromStart = differenceInMinutes(currentTime, startOfDayTime);
    if (minutesFromStart < 0 || minutesFromStart > totalMinutes) return null;
    return { top: `${(minutesFromStart / totalMinutes) * 100}%` };
  }, [currentTime, finalConfig]);

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onSlotClick) return;
    const rect = containerRef.current.getBoundingClientRect();
    const minutes = Math.round(
      ((e.clientY - rect.top) / rect.height) *
        ((finalConfig.endHour - finalConfig.startHour) * 60)
    );
    let clickTime = roundToNearestStep(
      setMinutes(setHours(new Date(), finalConfig.startHour), minutes),
      finalConfig.step
    );

    const startOfDay = setMinutes(
      setHours(new Date(), finalConfig.startHour),
      0
    );
    const endOfDay = setMinutes(setHours(new Date(), finalConfig.endHour), 0);
    if (clickTime < startOfDay) clickTime = startOfDay;
    if (clickTime > endOfDay) clickTime = endOfDay;
    onSlotClick(clickTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const minutes = Math.round(
      ((e.clientY - rect.top) / rect.height) *
        ((finalConfig.endHour - finalConfig.startHour) * 60)
    );
    setHoverTime(
      format(
        roundToNearestStep(
          setMinutes(setHours(new Date(), finalConfig.startHour), minutes),
          finalConfig.step
        ),
        "HH:mm"
      )
    );
  };

  const hours = Array.from(
    { length: finalConfig.endHour - finalConfig.startHour + 1 },
    (_, i) => finalConfig.startHour + i
  );

  return (
    <Card className="bg-card/50 flex h-full flex-col overflow-hidden border-none shadow-sm">
      <CardHeader className="bg-card sticky top-0 z-10 shrink-0 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg">
            Lịch trình hôm nay
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden items-center gap-1 font-normal md:flex"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {format(new Date(), "EEEE, dd/MM", { locale: vi })}
            </Badge>
            <Button
              size="sm"
              className="h-8"
              onClick={() => onSlotClick?.(new Date())}
            >
              <Plus className="size-4" /> Đặt mới
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="custom-scrollbar bg-background relative flex-1 overflow-y-auto">
        <div className="relative flex h-full min-h-[800px]">
          <div
            className="bg-muted/5 bg-background z-20 flex w-16 shrink-0 select-none flex-col border-r"
            aria-hidden="true"
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-border/50 relative flex-1 border-b"
              >
                <span className="text-muted-foreground bg-background absolute -top-3 right-3 px-1 text-xs font-medium">
                  {hour}:00
                </span>
              </div>
            ))}
          </div>

          <div
            ref={containerRef}
            className="group relative flex-1 cursor-pointer"
            onClick={handleGridClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverTime(null)}
            role="grid"
            tabIndex={0}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-border/30 pointer-events-none absolute w-full border-b"
                style={{
                  top: `${(((hour - finalConfig.startHour) * 60) / ((finalConfig.endHour - finalConfig.startHour) * 60)) * 100}%`,
                }}
              />
            ))}

            {hoverTime && (
              <div
                className="border-primary/40 pointer-events-none absolute z-0 flex w-full items-center border-t-2 border-dashed"
                style={{
                  top: `${((parseInt(hoverTime.split(":")[0]) * 60 + parseInt(hoverTime.split(":")[1]) - finalConfig.startHour * 60) / ((finalConfig.endHour - finalConfig.startHour) * 60)) * 100}%`,
                }}
              >
                <span className="bg-primary text-primary-foreground animate-fade-in ml-0 rounded-r px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                  {hoverTime}
                </span>
              </div>
            )}

            {currentTimeStyle && (
              <div
                className="pointer-events-none absolute z-20 flex w-full items-center border-t-2 border-red-500/80 transition-all duration-300"
                style={currentTimeStyle}
              >
                <div className="border-background absolute -left-[5px] h-2.5 w-2.5 animate-pulse rounded-full border-2 bg-red-500" />
              </div>
            )}

            {layoutItems.map((app) => {
              const status = statusMap[app.status] || statusMap.PENDING;
              return (
                <div
                  key={app.id}
                  className={cn(
                    "group/item focus-visible:ring-primary absolute cursor-pointer overflow-hidden rounded-lg border p-2 text-xs shadow-sm transition-all hover:z-30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 md:text-sm",
                    status.bgClass,
                    status.borderClass
                  )}
                  style={{
                    top: `${app.top}%`,
                    height: `${app.height}%`,
                    left: `calc(${app.left}% + 4px)`,
                    width: `calc(${app.width}% - 8px)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick?.(app);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="relative flex h-full items-start justify-between gap-1">
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 top-0 w-1",
                        status.className.replace("text-", "bg-")
                      )}
                    />
                    <div className="flex h-full w-full flex-col pl-2.5">
                      <span
                        className={cn(
                          "line-clamp-1 text-[11px] font-semibold leading-tight md:text-sm",
                          status.className
                        )}
                      >
                        {app.serviceName}
                      </span>
                      {app.height > 5 && (
                        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px] md:text-xs">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">
                            {format(new Date(app.startTime), "HH:mm")} -{" "}
                            {format(
                              setMinutes(
                                new Date(app.startTime),
                                new Date(app.startTime).getMinutes() +
                                  app.durationMinutes
                              ),
                              "HH:mm"
                            )}
                          </span>
                        </div>
                      )}
                      {app.technicianName && app.height > 10 && (
                        <div className="mt-auto hidden items-center gap-1.5 pt-2 md:flex">
                          <Avatar className="border-background size-4 border">
                            <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                              {app.technicianName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground max-w-[120px] truncate text-[11px]">
                            {app.technicianName}
                          </span>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="-mr-1 -mt-1 h-8 min-h-[32px] w-8 min-w-[32px] opacity-0 transition-opacity hover:bg-black/5 focus:opacity-100 group-hover/item:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onAppointmentClick?.(app)}
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={app.status === "CANCELLED"}>
                          Dời lịch
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Hủy hẹn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
