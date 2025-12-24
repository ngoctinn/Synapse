"use client";

/**
 * ConflictWarning - Hiển thị cảnh báo xung đột lịch hẹn
 *
 * Hiển thị trong form hoặc sheet khi phát hiện conflict.
 */

import { AlertTriangle, Clock, User, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription, AlertTitle, Button } from "@/shared/ui";

import type { ConflictInfo } from "../../model/types";

// TYPES

interface ConflictWarningProps {
  conflicts: ConflictInfo[];
  onDismiss?: () => void;
  onViewConflict?: (eventId: string) => void;
  className?: string;
}

// COMPONENT

export function ConflictWarning({
  conflicts,
  onDismiss,
  onViewConflict,
  className,
}: ConflictWarningProps) {
  if (conflicts.length === 0) return null;

  const hasError = conflicts.some((c) => c.severity === "error");
  const hasWarning = conflicts.some((c) => c.severity === "warning");

  return (
    <Alert
      variant={hasError ? "destructive" : "default"}
      className={cn(
        hasWarning &&
          !hasError &&
          "border-amber-500 bg-amber-50 dark:bg-amber-950/20",
        className
      )}
    >
      <AlertTriangle
        className={cn(
          "size-4",
          hasError ? "text-destructive" : "text-amber-500"
        )}
      />
      <AlertTitle className="flex items-center justify-between">
        <span>{hasError ? "Xung đột lịch hẹn" : "Cảnh báo lịch hẹn"}</span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 h-6 w-6"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        {conflicts.map((conflict, index) => (
          <div
            key={`${conflict.eventId}-${index}`}
            className={cn(
              "flex items-start gap-2 rounded-lg p-2 text-sm",
              conflict.severity === "error"
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-amber-100 dark:bg-amber-900/20"
            )}
          >
            {conflict.type === "overlap" ? (
              <Clock className="mt-0.5 size-4 flex-shrink-0" />
            ) : (
              <User className="mt-0.5 size-4 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p>{conflict.message}</p>
              {onViewConflict && conflict.eventId && (
                <button
                  type="button"
                  className="text-primary mt-1 text-xs hover:underline"
                  onClick={() => onViewConflict(conflict.eventId)}
                >
                  Xem lịch hẹn xung đột →
                </button>
              )}
            </div>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
}

// INLINE CONFLICT INDICATOR

interface ConflictIndicatorProps {
  hasConflict: boolean;
  message?: string;
  className?: string;
}

export function ConflictIndicator({
  hasConflict,
  message,
  className,
}: ConflictIndicatorProps) {
  if (!hasConflict) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
        "bg-red-100 text-xs font-medium text-red-700",
        "dark:bg-red-900/30 dark:text-red-400",
        className
      )}
    >
      <AlertTriangle className="h-3 w-3" />
      <span>{message || "Xung đột"}</span>
    </div>
  );
}
