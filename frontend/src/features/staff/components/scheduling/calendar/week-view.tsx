"use client";

import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

import { cn } from "@/shared/lib/utils";
import { getSchedulesByStaffAndDate } from "../../../model/schedules";
import { Schedule, ScheduleWithShift, SelectedSlot, Staff } from "../../../model/types";
import { ScheduleCell } from "./schedule-cell";

interface WeekViewProps {
  staffList: Staff[];
  schedules: Schedule[];
  weekDays: Date[];
  selectedSlots: SelectedSlot[];
  selectionMode: boolean;
  onAddSchedule: (staffId: string, date: Date) => void;
  onScheduleClick: (schedule: ScheduleWithShift) => void;
  onCellSelect: (staffId: string, dateStr: string) => void;
  className?: string;
}

/**
 * Grid lịch làm việc theo tuần
 * Hiển thị danh sách nhân viên (rows) x 7 ngày (columns)
 */
export function WeekView({
  staffList,
  schedules,
  weekDays,
  selectedSlots,
  selectionMode,
  onAddSchedule,
  onScheduleClick,
  onCellSelect,
  className,
}: WeekViewProps) {
  const today = new Date();

  if (staffList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed m-4">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-medium text-foreground">Chưa có nhân viên</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          Thêm nhân viên vào hệ thống để bắt đầu xếp lịch làm việc.
        </p>
      </div>
    );
  }

  const isSlotSelected = (staffId: string, dateStr: string) =>
    selectedSlots.some((s) => s.staffId === staffId && s.dateStr === dateStr);

  return (
    <div className={cn("flex flex-col select-none", className)}>
      <div className="relative overflow-hidden">
        {/* Scroll indicators */}
        <div className="absolute top-0 bottom-0 left-[180px] w-4 bg-gradient-to-r from-background to-transparent z-40 pointer-events-none lg:hidden" />
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-background to-transparent z-40 pointer-events-none lg:hidden" />

        <div className="min-w-[800px] overflow-x-auto">
          {/* Header row - Days of week */}
          <div className="grid grid-cols-[180px_repeat(7,1fr)] bg-background border-b sticky top-0 z-30">
            <div className="p-2 font-medium text-sm border-r flex items-center text-muted-foreground sticky left-0 bg-background z-40">
              Nhân viên
            </div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "p-2 text-center border-r last:border-r-0 flex flex-col justify-center",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs capitalize mb-0.5",
                      isToday ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {format(day, "EEEE", { locale: vi })}
                  </div>
                  <div className={cn("font-semibold text-sm", isToday && "text-primary")}>
                    {format(day, "dd/MM")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staff rows */}
          <div className="divide-y">
            {staffList.map((staff) => (
              <div
                key={staff.user_id}
                className="grid grid-cols-[180px_repeat(7,1fr)] group hover:bg-muted/5 transition-colors"
              >
                {/* Staff info column */}
                <div className="p-2 border-r flex items-center gap-2 bg-background group-hover:bg-muted/5 transition-colors sticky left-0 z-20">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={staff.user.avatar_url || "/placeholder-avatar.png"}
                      alt={staff.user.full_name || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden min-w-0">
                    <span className="text-sm font-medium truncate">
                      {staff.user.full_name || "Chưa có tên"}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize truncate">
                      {staff.title}
                    </span>
                  </div>
                </div>

                {/* Day cells */}
                {weekDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const daySchedules = getSchedulesByStaffAndDate(schedules, staff.user_id, dateStr);
                  const isToday = isSameDay(day, today);
                  const isSelected = isSlotSelected(staff.user_id, dateStr);

                  return (
                    <ScheduleCell
                      key={day.toISOString()}
                      schedules={daySchedules}
                      isToday={isToday}
                      isSelected={isSelected}
                      selectionMode={selectionMode}
                      onAddClick={() => onAddSchedule(staff.user_id, day)}
                      onScheduleClick={onScheduleClick}
                      onCellClick={() => onCellSelect(staff.user_id, dateStr)}
                    />
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
