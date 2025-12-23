"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Loader2, RotateCcw, Save } from "lucide-react";
import * as React from "react";

interface SettingsHeaderProps {
  isDirty?: boolean;
  isPending?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  dirtyLabel?: string;
  cleanLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SettingsHeader({
  isDirty = false,
  isPending = false,
  onSave,
  onReset,
  dirtyLabel = "Chưa lưu thay đổi",
  cleanLabel = "Đã đồng bộ",
  children,
  className,
}: SettingsHeaderProps) {
  return (
    <div
      className={cn(
        "bg-background/95 support-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex flex-col items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur-sm transition-all duration-300 md:flex-row",
        className
      )}
    >
      {/* Left Content (Usually Tabs or Title) */}
      <div className="flex w-full justify-center md:w-auto md:justify-start">
        {children}
      </div>

      {/* Right Content (Actions) */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
            isDirty
              ? "bg-warning/10 text-warning border-warning/20"
              : "bg-success/10 text-success border-success/20"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                isDirty ? "bg-warning" : "bg-success"
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isDirty ? "bg-warning" : "bg-success"
              )}
            />
          </span>
          {isDirty ? dirtyLabel : cleanLabel}
        </div>

        {/* Reset Button */}
        {onReset && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onReset}
                  disabled={!isDirty || isPending}
                  className="hidden h-9 px-4 sm:flex"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Khôi phục
                </Button>
              </TooltipTrigger>
              <TooltipContent>Khôi phục về cài đặt gốc</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Save Button */}
        {onSave && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  disabled={!isDirty || isPending}
                  className={cn(
                    "h-9 px-6 transition-all duration-300",
                    isDirty && "animate-pulse-subtle"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lưu cấu hình (Ctrl+S)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
