"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { Bed, Box, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { MaintenanceTask, Resource } from "../model/types";

interface MaintenanceTimelineProps {
  resources: Resource[];
  tasks: MaintenanceTask[];
  onTaskClick?: (task: MaintenanceTask) => void;
}

export function MaintenanceTimeline({
  resources,
  tasks,
  onTaskClick,
}: MaintenanceTimelineProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start

  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(startDate, i)),
    [startDate]
  );

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Optimize: Create a fast lookup map for tasks
  // Key: `${resourceId}-${dateString}` -> Value: MaintenanceTask[]
  const tasksMap = React.useMemo(() => {
    const map = new Map<string, MaintenanceTask[]>();

    tasks.forEach((task) => {
      const dateKey = format(new Date(task.date), "yyyy-MM-dd");
      const key = `${task.resourceId}-${dateKey}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(task);
    });

    return map;
  }, [tasks]);

  const getTasksForCell = (resId: string, date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return tasksMap.get(`${resId}-${dateKey}`) || [];
  };

  const STATUS_STYLES = {
    completed:
      "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20 dark:text-green-400 dark:border-green-800",
    scheduled:
      "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    overdue:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    in_progress:
      "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800",
    default: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  };

  const getStatusColor = (status: string) => {
    return (
      STATUS_STYLES[status as keyof typeof STATUS_STYLES] ||
      STATUS_STYLES.default
    );
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "scheduled":
        return "Đã lên lịch";
      case "overdue":
        return "Quá hạn";
      case "in_progress":
        return "Đang thực hiện";
      default:
        return "Khác";
    }
  };

  return (
    <div className="bg-card ring-border/50 flex h-full flex-col overflow-hidden rounded-lg border shadow-sm ring-1">
      {/* Header Toolbar */}
      <div className="bg-muted/20 flex flex-col items-start justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h3 className="font-serif text-lg font-semibold">Lịch Bảo Trì</h3>
          <div className="bg-background flex items-center rounded-lg border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted h-8 min-h-[32px] w-8 min-w-[32px] rounded-r-none"
              onClick={handlePrevWeek}
              aria-label="Tuần trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[140px] px-3 text-center text-sm font-medium tabular-nums">
              {format(startDate, "'Tuần' w, yyyy", { locale: vi })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted h-8 min-h-[32px] w-8 min-w-[32px] rounded-l-none"
              onClick={handleNextWeek}
              aria-label="Tuần sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="hover-info-badge">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Sắp tới</span>
          </div>
          <div className="hover-info-badge">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Đang xử lý</span>
          </div>
          <div className="hover-info-badge">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Hoàn thành</span>
          </div>
          <div className="hover-info-badge">
            <div className="bg-destructive h-2.5 w-2.5 rounded-full" />
            <span className="text-muted-foreground">Quá hạn</span>
          </div>
        </div>
      </div>

      {/* Main Timeline Grid */}
      <div className="relative flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="bg-card sticky top-0 z-30 grid grid-cols-[250px_repeat(7,1fr)] border-b shadow-sm">
            {/* Sticky First Column Header */}
            <div className="text-muted-foreground bg-muted/10 supports-[backdrop-filter]:bg-background/80 sticky left-0 z-40 flex items-center border-r p-3 font-medium backdrop-blur-md">
              Tài nguyên
            </div>

            {/* Date Headers */}
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-r p-3 text-center transition-colors last:border-r-0",
                    isToday ? "bg-primary/5" : ""
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-medium uppercase",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {format(day, "EEE", { locale: vi })}
                  </div>
                  <div
                    className={cn(
                      "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
                      isToday
                        ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                        : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Body */}
          <div className="relative z-0 divide-y">
            {resources.map((res) => (
              <div
                key={res.id}
                className="hover:bg-muted/5 group grid grid-cols-[250px_repeat(7,1fr)] transition-colors"
              >
                {/* Sticky Resource Cell */}
                <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 group-hover:bg-muted/20 sticky left-0 z-20 flex items-center gap-3 border-r p-3 backdrop-blur transition-colors">
                  <div className="bg-muted relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-sm">
                    {res.image ? (
                      <Image
                        src={res.image}
                        alt={res.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <>
                        {res.type === "ROOM" ? (
                          <Bed className="text-muted-foreground/50 h-5 w-5" />
                        ) : (
                          <Box className="text-muted-foreground/50 h-5 w-5" />
                        )}
                      </>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">
                      {res.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Badge variant="outline" size="xs">
                        {res.type === "ROOM" ? "Phòng" : "Thiết bị"}
                      </Badge>
                      <span className="text-muted-foreground truncate font-mono text-[10px]">
                        #{res.code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Cells */}
                {weekDays.map((day) => {
                  const dayTasks = getTasksForCell(res.id, day);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "relative min-h-[80px] border-r p-2 transition-colors last:border-r-0",
                        isToday ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="flex flex-col gap-1.5">
                        <TooltipProvider delayDuration={200}>
                          {dayTasks.map((task) => (
                            <Tooltip key={task.id}>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onTaskClick?.(task)}
                                  className={cn(
                                    "w-full cursor-pointer truncate rounded-md border p-1.5 text-left text-xs shadow-sm transition-all",
                                    "hover:scale-[1.02] hover:shadow-md",
                                    "focus:ring-ring focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1",
                                    getStatusColor(task.status)
                                  )}
                                >
                                  <span className="font-medium">
                                    {format(new Date(task.date), "HH:mm")}
                                  </span>
                                  {task.title}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="border-border/50 max-w-[200px] shadow-xl"
                              >
                                <p className="mb-1 text-sm font-semibold">
                                  {task.title}
                                </p>
                                <div className="text-muted-foreground flex items-center justify-between text-xs">
                                  <span>
                                    {format(new Date(task.date), "HH:mm")}
                                  </span>
                                  <span
                                    className={cn(
                                      "bg-muted text-foreground rounded-sm px-1.5 py-0.5 font-medium"
                                    )}
                                  >
                                    {getStatusLabel(task.status)}
                                  </span>
                                </div>
                                {task.notes && (
                                  <p className="text-muted-foreground/80 mt-2 line-clamp-3 border-t pt-2 text-xs">
                                    {task.notes}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
