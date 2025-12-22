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

  const weekDays = React.useMemo(() =>
    Array.from({ length: 7 }).map((_, i) => addDays(startDate, i)),
  [startDate]);

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Optimize: Create a fast lookup map for tasks
  // Key: `${resourceId}-${dateString}` -> Value: MaintenanceTask[]
  const tasksMap = React.useMemo(() => {
    const map = new Map<string, MaintenanceTask[]>();

    tasks.forEach(task => {
        const dateKey = format(new Date(task.date), 'yyyy-MM-dd');
        const key = `${task.resourceId}-${dateKey}`;

        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)?.push(task);
    });

    return map;
  }, [tasks]);

  const getTasksForCell = (resId: string, date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksMap.get(`${resId}-${dateKey}`) || [];
  };

  const STATUS_STYLES = {
    completed: "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20 dark:text-green-400 dark:border-green-800",
    scheduled: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    overdue: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    in_progress: "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800",
    default: "bg-muted text-muted-foreground border-border hover:bg-muted/80"
  };

  const getStatusColor = (status: string) => {
    return STATUS_STYLES[status as keyof typeof STATUS_STYLES] || STATUS_STYLES.default;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
        case "completed": return "Hoàn thành";
        case "scheduled": return "Đã lên lịch";
        case "overdue": return "Quá hạn";
        case "in_progress": return "Đang thực hiện";
        default: return "Khác";
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-border/50">

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-muted/20 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-serif font-semibold text-lg">Lịch Bảo Trì</h3>
          <div className="flex items-center bg-background rounded-md border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-r-none hover:bg-muted"
              onClick={handlePrevWeek}
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium min-w-[140px] text-center tabular-nums">
              {format(startDate, "'Tuần' w, yyyy", { locale: vi })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-l-none hover:bg-muted"
              onClick={handleNextWeek}
              aria-label="Tuần sau"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="hover-info-badge">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Sắp tới</span>
          </div>
          <div className="hover-info-badge">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Đang xử lý</span>
          </div>
          <div className="hover-info-badge">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Hoàn thành</span>
          </div>
           <div className="hover-info-badge">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Quá hạn</span>
          </div>
        </div>
      </div>


      {/* Main Timeline Grid */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[800px]">

          {/* Table Header */}
          <div className="grid grid-cols-[250px_repeat(7,1fr)] bg-card border-b sticky top-0 z-30 shadow-sm">
            {/* Sticky First Column Header */}
            <div className="p-3 font-medium text-muted-foreground bg-muted/10 border-r flex items-center sticky left-0 z-40 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
              Tài nguyên
            </div>

            {/* Date Headers */}
            {weekDays.map((day) => {
               const isToday = isSameDay(day, new Date());
               return (
                <div
                    key={day.toISOString()}
                    className={cn(
                    "p-3 text-center border-r last:border-r-0 transition-colors",
                    isToday ? "bg-primary/5" : ""
                    )}
                >
                    <div className={cn(
                        "text-xs uppercase font-medium",
                        isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                    {format(day, "EEE", { locale: vi })}
                    </div>
                    <div
                    className={cn(
                        "text-sm font-semibold mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all",
                        isToday
                        ? "bg-primary text-primary-foreground shadow-sm scale-110"
                        : "text-foreground"
                    )}
                    >
                    {format(day, "d")}
                    </div>
                </div>
            )})}
          </div>


          {/* Table Body */}
          <div className="divide-y relative z-0">
            {resources.map((res) => (
              <div
                key={res.id}
                className="grid grid-cols-[250px_repeat(7,1fr)] hover:bg-muted/5 transition-colors group"
              >

                {/* Sticky Resource Cell */}
                <div className="p-3 border-r flex items-center gap-3 sticky left-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 group-hover:bg-muted/20 transition-colors">
                  <div className="relative w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shrink-0 shadow-sm">
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
                      {res.type === 'ROOM' ? <Bed className="w-5 h-5 text-muted-foreground/50" /> : <Box className="w-5 h-5 text-muted-foreground/50" />}
                      </>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate text-foreground">
                      {res.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" size="xs">
                         {res.type === 'ROOM' ? 'Phòng' : 'Thiết bị'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground truncate font-mono">
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
                        "p-2 border-r last:border-r-0 min-h-[80px] relative transition-colors",
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
                                        "text-xs p-1.5 rounded-md border text-left transition-all shadow-sm w-full truncate cursor-pointer",
                                        "hover:shadow-md hover:scale-[1.02]",
                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:z-10",
                                        getStatusColor(task.status)
                                        )}
                                    >
                                        <span className="font-medium mr-1">{format(new Date(task.date), 'HH:mm')}</span>
                                        {task.title}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[200px] border-border/50 shadow-xl">
                                    <p className="font-semibold text-sm mb-1">{task.title}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{format(new Date(task.date), 'HH:mm')}</span>
                                        <span className={cn("px-1.5 py-0.5 rounded-sm bg-muted text-foreground font-medium", )}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </div>
                                    {task.notes && (
                                        <p className="text-xs mt-2 pt-2 border-t text-muted-foreground/80 line-clamp-3">
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
