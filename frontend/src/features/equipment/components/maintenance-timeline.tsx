"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import * as React from "react";
import { Equipment, MaintenanceTask } from "../model/types";

interface MaintenanceTimelineProps {
  equipment: Equipment[];
  tasks: MaintenanceTask[];
  onTaskClick: (task: MaintenanceTask) => void;
}

export function MaintenanceTimeline({
  equipment,
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

  const getTasksForCell = (eqId: string, date: Date) => {
    return tasks.filter(
      (t) => t.equipmentId === eqId && isSameDay(new Date(t.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-4">
          <h3 className="font-serif font-semibold text-lg">Lịch Bảo Trì</h3>
          <div className="flex items-center bg-background rounded-md border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={handlePrevWeek}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium min-w-[140px] text-center">
              {format(startDate, "'Tuần' w, yyyy", { locale: vi })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={handleNextWeek}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Sắp tới</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Hoàn thành</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Quá hạn</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-[250px_repeat(7,1fr)] border-b sticky top-0 bg-card z-10">
            <div className="p-3 font-medium text-muted-foreground bg-muted/10 border-r">
              Thiết bị
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

          {/* Body Rows */}
          <div className="divide-y">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="grid grid-cols-[250px_repeat(7,1fr)] hover:bg-muted/5 transition-colors group"
              >
                {/* Equipment Info */}
                <div className="p-3 border-r flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shrink-0">
                    {eq.image ? (
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {eq.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {eq.code}
                    </div>
                  </div>
                </div>

                {/* Days Cells */}
                {weekDays.map((day) => {
                  const dayTasks = getTasksForCell(eq.id, day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "p-2 border-r last:border-r-0 min-h-[80px] relative",
                        isSameDay(day, new Date()) ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        {dayTasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => onTaskClick(task)}
                            className={cn(
                              "text-xs p-1.5 rounded-md border text-left transition-all shadow-sm w-full truncate",
                              getStatusColor(task.status)
                            )}
                          >
                            {task.title}
                          </button>
                        ))}
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
