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

// ============================================
// TYPES
// ============================================

interface ViewSwitcherProps {
  value: CalendarViewType;
  onChange: (view: CalendarViewType) => void;
  className?: string;
  /** Ẩn một số views (ví dụ: ẩn timeline trên mobile) */
  hiddenViews?: CalendarViewType[];
}

// ============================================
// VIEW ICONS
// ============================================

const VIEW_ICONS: Record<CalendarViewType, React.ReactNode> = {
  day: <CalendarDays className="h-4 w-4" />,
  week: <Calendar className="h-4 w-4" />,
  month: <CalendarRange className="h-4 w-4" />,
  agenda: <List className="h-4 w-4" />,
  timeline: <GanttChart className="h-4 w-4" />,
};

// ============================================
// COMPONENT
// ============================================

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
      <TabsList className="h-9">
        {visibleViews.map((view) => (
          <TabsTrigger
            key={view}
            value={view}
            className={cn(
              "gap-1.5 px-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "transition-all duration-200"
            )}
            title={CALENDAR_VIEW_CONFIG[view].description}
          >
            {VIEW_ICONS[view]}
            {/* Ẩn label trên mobile, hiện trên sm+ */}
            <span className="hidden sm:inline text-xs">
              {CALENDAR_VIEW_CONFIG[view].label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
