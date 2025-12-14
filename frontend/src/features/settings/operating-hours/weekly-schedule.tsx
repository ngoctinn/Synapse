"use client";

/**
 * WeeklySchedule - Component quản lý lịch làm việc 7 ngày
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.1
 *
 * TODO: Implement full UI in Phase 3
 */

import { SurfaceCard } from "@/shared/components/layout/page-layout";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { OperatingHoursConfig } from "./types";

interface WeeklyScheduleProps {
  config: OperatingHoursConfig;
  onConfigChange: (config: OperatingHoursConfig) => void;
}

export function WeeklySchedule({ config, onConfigChange }: WeeklyScheduleProps) {
  return (
    <SurfaceCard>
      <CardHeader>
        <CardTitle>Lịch làm việc</CardTitle>
        <CardDescription>
          Cấu hình giờ mở cửa cho từng ngày trong tuần
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {config.weeklySchedule.map((day) => (
            <div
              key={day.dayOfWeek}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <span className="font-medium">{day.label}</span>
              <span className="text-muted-foreground">
                {day.isOpen
                  ? day.timeSlots.map(s => `${s.start} - ${s.end}`).join(", ")
                  : "Đóng cửa"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          🚧 Component đang được xây dựng lại theo thiết kế mới
        </p>
      </CardContent>
    </SurfaceCard>
  );
}

// Legacy alias for backwards compatibility
export { WeeklySchedule as ScheduleEditor };
