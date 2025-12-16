"use client";

import { Send, Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Badge, Button } from "@/shared/ui";

interface ActionBarProps {
  draftCount: number;
  onManageShifts: () => void;
  onPublishAll: () => void;
  isPublishing?: boolean;
  className?: string;
}

/**
 * Thanh action buttons: Quản lý ca, Công bố
 */
export function ActionBar({
  draftCount,
  onManageShifts,
  onPublishAll,
  isPublishing = false,
  className,
}: ActionBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Manage Shifts Button */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 gap-2"
        onClick={onManageShifts}
      >
        <Settings className="size-4" />
        <span className="hidden sm:inline">Quản lý ca</span>
      </Button>

      {/* Publish All Button */}
      {draftCount > 0 && (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 gap-2"
          onClick={onPublishAll}
          disabled={isPublishing}
        >
          <Send className="size-4" />
          <span className="hidden sm:inline">Công bố</span>
          <Badge
            variant="secondary"
            className="ml-1 h-5 px-1.5 text-[10px] bg-primary-foreground/20"
          >
            {draftCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
