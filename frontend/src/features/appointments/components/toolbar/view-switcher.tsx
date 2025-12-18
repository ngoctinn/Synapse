"use client";

/**
 * ViewSwitcher - Component chuyển đổi chế độ xem Calendar
 *
 * Tabs để chuyển giữa: Ngày | Tuần | Tháng | Danh sách | Timeline
 * Responsive: Hiển thị icon only trên mobile.
 */

import {
  Calendar,
  CalendarDays,
  CalendarRange,
  GanttChart,
  List,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";

import { CALENDAR_VIEW_CONFIG } from "../../constants";
import type { CalendarViewType } from "../../types";

// TYPES

interface ViewSwitcherProps {
  value: CalendarViewType;
  onChange: (view: CalendarViewType) => void;
  className?: string;
  /** Ẩn một số views (ví dụ: ẩn timeline trên mobile) */
  hiddenViews?: CalendarViewType[];
}

// VIEW ICONS

const VIEW_ICONS: Record<CalendarViewType, React.ReactNode> = {
  day: <CalendarDays className="size-4" />,
  week: <Calendar className="size-4" />,
  month: <CalendarRange className="size-4" />,
  agenda: <List className="size-4" />,
  timeline: <GanttChart className="size-4" />,
};

// COMPONENT

export function ViewSwitcher({
  value,
  onChange,
  className,
  hiddenViews = [],
}: ViewSwitcherProps) {
  const visibleViews = (
    Object.keys(CALENDAR_VIEW_CONFIG) as CalendarViewType[]
  ).filter((view) => !hiddenViews.includes(view));

  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as CalendarViewType)}
      className={className}
    >
      <TabsList className="h-9 w-fit p-1 bg-muted/50">
        {visibleViews.map((view) => (
          <TabsTrigger
            key={view}
            value={view}
            className={cn(
              "px-0 min-w-8 w-8 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm",
              "transition-all duration-200"
            )}
            title={CALENDAR_VIEW_CONFIG[view].description}
          >
            {VIEW_ICONS[view]}
            {/* Icon Only as requested */}
            <span className="sr-only">
              {CALENDAR_VIEW_CONFIG[view].label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
