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
        "relative min-w-[5rem] flex-grow items-center justify-center gap-1 md:min-w-[6rem]",
        "transition-all duration-150 ease-in-out",
        !isAvailable && "cursor-not-allowed line-through opacity-50",
        isDisabled && "cursor-not-allowed opacity-30",
        isSelected &&
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary focus:ring-2 focus:ring-offset-2",
        !isSelected &&
          isAvailable &&
          "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={onClick}
      disabled={!isAvailable || isDisabled}
    >
      <Clock className="size-3.5" />
      <span>{time}</span>
      {isSelected && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="bg-primary-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="bg-primary-foreground relative inline-flex h-3 w-3 rounded-full"></span>
        </span>
      )}
    </Button>
  );
};
