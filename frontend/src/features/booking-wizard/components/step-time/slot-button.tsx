"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Clock } from "lucide-react";
import React from "react";

interface SlotButtonProps {
  time: string; // e.g., "09:00"
  isAvailable: boolean;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

export const SlotButton: React.FC<SlotButtonProps> = ({
  time,
  isAvailable,
  isSelected,
  isDisabled,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "relative flex-grow min-w-[5rem] md:min-w-[6rem] justify-center items-center gap-1",
        "transition-all duration-150 ease-in-out",
        !isAvailable && "opacity-50 cursor-not-allowed line-through",
        isDisabled && "opacity-30 cursor-not-allowed",
        isSelected &&
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2",
        !isSelected && isAvailable && "hover:bg-accent hover:text-accent-foreground",
      )}
      onClick={onClick}
      disabled={!isAvailable || isDisabled}
    >
      <Clock className="size-3.5" />
      <span>{time}</span>
      {isSelected && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground"></span>
        </span>
      )}
    </Button>
  );
};
