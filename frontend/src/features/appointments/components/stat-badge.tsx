"use client";

import { LucideIcon } from "lucide-react";
import { Icon } from "@/shared/ui/custom/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface StatBadgeProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  highlight?: boolean;
  badge?: boolean;
}

export function StatBadge({
  icon: InnerIcon,
  value,
  label,
  highlight = false,
  badge = false,
}: StatBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex cursor-default items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-300 hover:shadow-md",
            highlight
              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-500"
              : "text-muted-foreground hover:border-border/50 hover:bg-muted/50 border-transparent shadow-sm"
          )}
        >
          <div className="relative">
            <Icon icon={InnerIcon} className="size-4" />
            {badge && (
              <span className="border-background absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border bg-amber-500" />
            )}
          </div>
          <span className="text-sm font-semibold leading-relaxed tabular-nums">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="px-3 py-1.5 text-xs font-medium" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
