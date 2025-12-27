"use client";

import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

import { cn } from "@/shared/lib/utils";
import { Grid } from "@/shared/ui/layout/grid";
import { VStack } from "@/shared/ui/layout/stack";
import { getSchedulesByStaffAndDate } from "../../../model/schedules";
import {
    Schedule,
    ScheduleWithShift,
    SelectedSlot,
    Staff,
} from "../../../model/types";
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
      <div className="bg-muted/10 m-4 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="bg-muted/50 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-foreground text-lg font-medium">
          Chưa có nhân viên
        </h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Thêm nhân viên vào hệ thống để bắt đầu xếp lịch làm việc.
        </p>
      </div>
    );
  }

  const isSlotSelected = (staffId: string, dateStr: string) =>
    selectedSlots.some((s) => s.staffId === staffId && s.dateStr === dateStr);

  return (
    <VStack className={cn("select-none", className)}>
      <div className="relative overflow-hidden">
        {/* Scroll indicators */}
        <div className="from-background pointer-events-none absolute bottom-0 left-[180px] top-0 z-40 w-4 bg-gradient-to-r to-transparent lg:hidden" />
        <div className="from-background pointer-events-none absolute bottom-0 right-0 top-0 z-40 w-4 bg-gradient-to-l to-transparent lg:hidden" />

        <div className="min-w-[800px] overflow-x-auto">
          {/* Header row - Days of week */}
          <Grid
            cols="180px repeat(7,1fr)"
            gap={0}
            className="bg-background sticky top-0 z-30 border-b"
          >
            <div className="text-muted-foreground bg-background sticky left-0 z-40 flex items-center border-r p-2 text-sm font-medium">
              Nhân viên
            </div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "flex flex-col justify-center border-r p-2 text-center last:border-r-0",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "mb-0.5 text-xs capitalize",
                      isToday
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(day, "EEEE", { locale: vi })}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      isToday && "text-primary"
                    )}
                  >
                    {format(day, "dd/MM")}
                  </div>
                </div>
              );
            })}
          </Grid>

          {/* Staff rows */}
          <div className="divide-y">
            {staffList.map((staff) => (
              <Grid
                key={staff.user_id}
                cols="180px repeat(7,1fr)"
                gap={0}
                className="hover:bg-muted/5 group transition-colors"
              >
                {/* Staff info column */}
                <div className="bg-background group-hover:bg-muted/5 sticky left-0 z-20 flex items-center gap-2 border-r p-2 transition-colors">
                  <div className="bg-muted h-8 w-8 shrink-0 overflow-hidden rounded-full border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={staff.user.avatar_url || "/placeholder-avatar.png"}
                      alt={staff.user.full_name || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {staff.user.full_name || "Chưa có tên"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs capitalize">
                      {staff.title}
                    </span>
                  </div>
                </div>

                {/* Day cells */}
                {weekDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const daySchedules = getSchedulesByStaffAndDate(
                    schedules,
                    staff.user_id,
                    dateStr
                  );
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
              </Grid>
            ))}
          </div>
        </div>
      </div>
    </VStack>
  );
}
