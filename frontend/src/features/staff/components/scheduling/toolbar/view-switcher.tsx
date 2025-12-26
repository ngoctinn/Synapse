"use client";

import { Calendar, CalendarDays } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";

import { SCHEDULE_VIEW_CONFIG } from "../../../model/constants";
import type { ScheduleViewType } from "../../../model/types";

const VIEW_ICONS: Record<ScheduleViewType, React.ReactNode> = {
  week: <CalendarDays className="size-4" />,
  month: <Calendar className="size-4" />,
};

interface ViewSwitcherProps {
  value: ScheduleViewType;
  onChange: (view: ScheduleViewType) => void;
  className?: string;
}

/**
 * Tabs chuyển đổi chế độ xem: Tuần | Tháng
 */
export function ViewSwitcher({
  value,
  onChange,
  className,
}: ViewSwitcherProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as ScheduleViewType)}
      className={className}
    >
      <TabsList size="sm" className="w-fit">
        {(Object.keys(SCHEDULE_VIEW_CONFIG) as ScheduleViewType[]).map(
          (view) => (
            <TabsTrigger
              key={view}
              value={view}
              className={cn(
                "h-7 gap-1.5 px-3 text-xs",
                "transition-all duration-200"
              )}
              title={SCHEDULE_VIEW_CONFIG[view].description}
            >
              {VIEW_ICONS[view]}
              <span className="hidden sm:inline">
                {SCHEDULE_VIEW_CONFIG[view].label}
              </span>
            </TabsTrigger>
          )
        )}
      </TabsList>
    </Tabs>
  );
}
