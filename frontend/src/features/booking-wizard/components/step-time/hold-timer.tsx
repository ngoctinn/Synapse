"use client";

import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Clock } from "lucide-react";
import React from "react";
import { useHoldTimer } from "../../hooks/use-hold-timer";

interface HoldTimerProps {
  expiresAt: Date | null;
  onExpire?: () => void;
  className?: string;
}

export const HoldTimer: React.FC<HoldTimerProps> = ({ expiresAt, onExpire, className }) => {
  const { minutes, seconds, timeLeft, isExpired } = useHoldTimer({ expiresAt, onExpire });

  if (!expiresAt || isExpired) return null;

  // Determine variant based on time left
  let variant: "success" | "warning" | "destructive" = "success";
  if (timeLeft < 60) {
    variant = "destructive";
  } else if (timeLeft < 300) {
    variant = "warning";
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        "px-3 py-1.5 rounded-full font-medium transition-colors duration-300",
        timeLeft < 60 && "animate-pulse",
        className
      )}
      role="timer"
      aria-live="polite"
    >
      <Clock className="w-4 h-4" />
      <span>
        Giữ chỗ trong: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </Badge>
  );
};
