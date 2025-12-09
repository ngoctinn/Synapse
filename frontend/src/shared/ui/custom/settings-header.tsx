'use client';

import * as React from "react";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { RotateCcw, Save, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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
    <div className={cn(
      "sticky top-0 z-40 px-4 py-3 bg-background/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 support-[backdrop-filter]:bg-background/60",
      className
    )}>
      {/* Left Content (Usually Tabs or Title) */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        {children}
      </div>

      {/* Right Content (Actions) */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 flex items-center gap-2",
          isDirty 
            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" 
            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        )}>
          <span className="relative flex h-2 w-2">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isDirty ? "bg-amber-500" : "bg-green-500"
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isDirty ? "bg-amber-500" : "bg-green-500"
            )} />
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
                  className="h-9 px-4 hidden sm:flex"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
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
