"use client";

import React from "react";
import { useHoldTimer } from "../../hooks/use-hold-timer";
import { cn } from "@/shared/lib/utils";
import { Clock } from "lucide-react";

interface HoldTimerProps {
  expiresAt: Date | null;
  onExpire?: () => void;
  className?: string;
}

export const HoldTimer: React.FC<HoldTimerProps> = ({ expiresAt, onExpire, className }) => {
  const { minutes, seconds, timeLeft, isExpired } = useHoldTimer({ expiresAt, onExpire });

  if (!expiresAt || isExpired) return null;

  // Color coding logic
  let colorClass = "text-green-600 bg-green-50 border-green-200";
  if (timeLeft < 60) { // Less than 1 minute
    colorClass = "text-red-600 bg-red-50 border-red-200 animate-pulse";
  } else if (timeLeft < 300) { // Less than 5 minutes
    colorClass = "text-amber-600 bg-amber-50 border-amber-200";
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors duration-300",
        colorClass,
        className
      )}
      role="timer"
      aria-live="polite"
    >
      <Clock className="w-4 h-4" />
      <span>
        Giữ chỗ trong: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
