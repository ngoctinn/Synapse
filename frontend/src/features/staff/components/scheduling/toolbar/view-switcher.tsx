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
      <TabsList className="bg-muted/50 h-9 w-fit p-1">
        {(Object.keys(SCHEDULE_VIEW_CONFIG) as ScheduleViewType[]).map(
          (view) => (
            <TabsTrigger
              key={view}
              value={view}
              className={cn(
                "h-7 gap-1.5 px-3 text-xs",
                "data-[state=active]:bg-background data-[state=active]:shadow-sm",
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
