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
    <div className={cn("rounded-lg border p-4 bg-slate-50", className)}>
      <h4 className="text-sm font-medium mb-2">Trực quan hóa thời gian</h4>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
        <span className="w-3 h-3  rounded-sm"></span> Phục vụ ({duration}p)
        <span className="w-3 h-3 bg-slate-300 rounded-sm pattern-diagonal-lines"></span> Nghỉ ({bufferTime}p)
      </div>
      <div className="h-6 w-full bg-white rounded-full overflow-hidden flex border">
        <div
          className="h-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300"
          style={{ width: `${durationPercent}%` }}
        >
          {duration}p
        </div>
        <div
          className="h-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold relative transition-all duration-300"
          style={{
            width: `${bufferPercent}%`,
            backgroundImage: "linear-gradient(45deg, #cbd5e1 25%, transparent 25%, transparent 50%, #cbd5e1 50%, #cbd5e1 75%, transparent 75%, transparent)",
            backgroundSize: "10px 10px"
          }}
        >
          {Number(bufferTime) > 0 && `${bufferTime}p`}
        </div>
      </div>
      <p className="text-xs text-right mt-1 font-medium text-slate-700">
        Tổng thời gian khóa lịch: {totalTime} phút
      </p>
    </div>
  );
}
