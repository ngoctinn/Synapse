"use client";

import { cn } from "@/shared/lib/utils";

export interface TimelineItem {
  startPercentage: number;
  widthPercentage: number;
  color: string;
  label: string;
  tooltip: string;
}

interface ResourceTimelineProps {
  duration: number;
  items: TimelineItem[];
  className?: string;
}

export function ResourceTimeline({
  duration,
  items,
  className,
}: ResourceTimelineProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm", className)}>
      <h4 className="mb-4 text-sm font-medium text-muted-foreground">
        Mô phỏng quy trình
      </h4>
      <div className="relative h-12 w-full rounded-lg bg-muted/30">
        {/* Time markers */}
        <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
          0p
        </div>
        <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">
          {duration}p
        </div>

        {/* Timeline Bars */}
        {items.map((item, index) => (
          <div
            key={index}
            className="absolute top-1/2 -translate-y-1/2 flex h-8 items-center justify-center rounded-md text-[10px] font-medium text-white shadow-sm transition-all hover:z-10"
            style={{
              left: `${item.startPercentage}%`,
              width: `${item.widthPercentage}%`,
              backgroundColor: item.color,
            }}
            title={item.tooltip}
          >
            <span className="truncate px-1">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-8"></div>
    </div>
  );
}
