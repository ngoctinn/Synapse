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

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const getTasksForCell = (resId: string, date: Date) => {
    return tasks.filter(
      (t) => t.resourceId === resId && isSameDay(new Date(t.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20";
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200 hover:bg-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
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
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">

      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-4">
          <h3 className="font-serif font-semibold text-lg">Lịch Bảo Trì</h3>
          <div className="flex items-center bg-background rounded-md border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-[44px] min-w-[44px] rounded-r-none"
              onClick={handlePrevWeek}
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium min-w-[140px] text-center">
              {format(startDate, "'Tuần' w, yyyy", { locale: vi })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-h-[44px] min-w-[44px] rounded-l-none"
              onClick={handleNextWeek}
              aria-label="Tuần sau"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted/50 transition-colors select-none">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Sắp tới</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted/50 transition-colors select-none">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Hoàn thành</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted/50 transition-colors select-none">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Quá hạn</span>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">

          <div className="grid grid-cols-[250px_repeat(7,1fr)] border-b sticky top-0 bg-card z-10">
            <div className="p-3 font-medium text-muted-foreground bg-muted/10 border-r">
              Tài nguyên
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 text-center border-r last:border-r-0",
                  isSameDay(day, new Date()) ? "bg-primary/5" : ""
                )}
              >
                <div className="text-xs text-muted-foreground uppercase">
                  {format(day, "EEE", { locale: vi })}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                    isSameDay(day, new Date())
                      ? "bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>


          <div className="divide-y">
            {resources.map((res) => (
              <div
                key={res.id}
                className="grid grid-cols-[250px_repeat(7,1fr)] hover:bg-muted/5 transition-colors group"
              >

                <div className="p-3 border-r flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shrink-0">
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
                      {res.type === 'ROOM' ? <Bed className="w-5 h-5 text-muted-foreground" /> : <Box className="w-5 h-5 text-muted-foreground" />}
                      </>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {res.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-auto">
                         {res.type === 'ROOM' ? 'Phòng' : 'Thiết bị'}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {res.code}
                      </span>
                    </div>
                  </div>
                </div>


                {weekDays.map((day) => {
                  const dayTasks = getTasksForCell(res.id, day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "p-2 border-r last:border-r-0 min-h-[80px] relative transition-colors",
                         isSameDay(day, new Date()) ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <TooltipProvider>
                            {dayTasks.map((task) => (
                            <Tooltip key={task.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onTaskClick?.(task)}
                                        className={cn(
                                        "text-xs p-1.5 rounded-md border text-left transition-all shadow-sm w-full truncate cursor-pointer",
                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                        "active:scale-95",
                                        getStatusColor(task.status)
                                        )}
                                    >
                                        {task.title}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-xs text-muted-foreground">{getStatusLabel(task.status)}</p>
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
