"use client";

import { cn } from "@/shared/lib/utils";

interface ServiceTimeVisualizerProps {
  duration: number;
  bufferTime: number;
  className?: string;
}

export function ServiceTimeVisualizer({
  duration,
  bufferTime,
  className,
}: ServiceTimeVisualizerProps) {
  const totalTime = Number(duration) + Number(bufferTime);
  const durationPercent =
    totalTime > 0 ? (Number(duration) / totalTime) * 100 : 0;
  const bufferPercent =
    totalTime > 0 ? (Number(bufferTime) / totalTime) * 100 : 0;

  return (
    <div className={cn("bg-card rounded-xl border p-5 shadow-sm", className)}>
      <h4 className="text-foreground mb-3 text-sm font-medium">
        Trực quan hóa thời gian
      </h4>

      <div className="text-muted-foreground mb-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary h-2.5 w-2.5 rounded-full shadow-sm"></span>
          <span>Phục vụ ({duration}p)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="bg-muted h-2.5 w-2.5 rounded-full border shadow-sm"></span>
          <span>Nghỉ ({bufferTime}p)</span>
        </div>
      </div>

      <div className="bg-muted/20 ring-border/50 flex h-8 w-full overflow-hidden rounded-lg ring-1">
        <div
          className="bg-primary text-primary-foreground group relative flex h-full items-center justify-center text-[11px] font-medium transition-all duration-300"
          style={{ width: `${durationPercent}%` }}
        >
          {duration > 0 && <span>{duration}p</span>}

          <div className="group-hover:animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div
          className="bg-muted text-muted-foreground relative flex h-full items-center justify-center text-[11px] font-medium transition-all duration-300"
          style={{
            width: `${bufferPercent}%`,
            backgroundImage:
              "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)",
            backgroundSize: "8px 8px",
          }}
        >
          {Number(bufferTime) > 0 && `${bufferTime}p`}
        </div>
      </div>

      <p className="text-muted-foreground mt-2 text-right text-xs">
        Tổng thời gian khóa lịch:{" "}
        <span className="text-foreground font-medium">{totalTime} phút</span>
      </p>
    </div>
  );
}
