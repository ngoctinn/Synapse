"use client";

import { cn } from "@/shared/lib/utils";

interface ServiceTimeVisualizerProps {
  duration: number;
  bufferTime: number;
  className?: string;
}

export function ServiceTimeVisualizer({ duration, bufferTime, className }: ServiceTimeVisualizerProps) {
  const totalTime = Number(duration) + Number(bufferTime);
  const durationPercent = totalTime > 0 ? (Number(duration) / totalTime) * 100 : 0;
  const bufferPercent = totalTime > 0 ? (Number(bufferTime) / totalTime) * 100 : 0;

  return (
    <div className={cn("rounded-xl border bg-card shadow-sm p-5", className)}>
      <h4 className="text-sm font-medium mb-3 text-foreground">Trực quan hóa thời gian</h4>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></span>
          <span>Phục vụ ({duration}p)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-muted shadow-sm border"></span>
          <span>Nghỉ ({bufferTime}p)</span>
        </div>
      </div>

      <div className="h-8 w-full bg-muted/20 rounded-lg overflow-hidden flex ring-1 ring-border/50">
        <div
          className="h-full bg-primary flex items-center justify-center text-[11px] text-primary-foreground font-medium transition-all duration-300 relative group"
          style={{ width: `${durationPercent}%` }}
        >
           {duration > 0 && <span>{duration}p</span>}

           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </div>
        <div
          className="h-full bg-muted flex items-center justify-center text-[11px] text-muted-foreground font-medium relative transition-all duration-300"
          style={{
            width: `${bufferPercent}%`,
            backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)",
            backgroundSize: "8px 8px"
          }}
        >
          {Number(bufferTime) > 0 && `${bufferTime}p`}
        </div>
      </div>

      <p className="text-xs text-right mt-2 text-muted-foreground">
        Tổng thời gian khóa lịch: <span className="font-medium text-foreground">{totalTime} phút</span>
      </p>
    </div>
  );
}
