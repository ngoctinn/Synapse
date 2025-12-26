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
    <div className={cn("rounded-lg border bg-card p-5 shadow-sm", className)}>
      <h4 className="mb-3 text-sm font-medium text-foreground">
        Trực quan hóa thời gian
      </h4>

      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm"></span>
          <span>Phục vụ ({duration}p)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border bg-muted shadow-sm"></span>
          <span>Nghỉ ({bufferTime}p)</span>
        </div>
      </div>

      <div className="flex h-8 w-full overflow-hidden rounded-lg bg-muted/20 ring-[1.5px] ring-border/50">
        <div
          className="relative flex h-full items-center justify-center bg-primary text-[11px] font-medium text-primary-foreground transition-all duration-300 group"
          style={{ width: `${durationPercent}%` }}
        >
          {duration > 0 && <span>{duration}p</span>}

          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
        </div>
        <div
          className="relative flex h-full items-center justify-center bg-muted text-[11px] font-medium text-muted-foreground transition-all duration-300"
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

      <p className="mt-2 text-right text-xs text-muted-foreground">
        Tổng thời gian khóa lịch:{" "}
        <span className="font-medium text-foreground">{totalTime} phút</span>
      </p>
    </div>
  );
}
