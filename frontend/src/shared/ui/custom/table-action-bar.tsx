"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Download, Trash2, X } from "lucide-react";
import { ReactNode } from "react";

interface TableActionBarProps {
  /** Số lượng items đã chọn */
  selectedCount: number;
  /** Handler cho action xóa */
  onDelete?: () => void;
  /** Handler cho action export */
  onExport?: () => void;
  /** Handler bỏ chọn tất cả */
  onDeselectAll: () => void;
  /** Label tùy chỉnh cho nút xóa */
  deleteLabel?: string;
  /** Label tùy chỉnh cho nút export */
  exportLabel?: string;
  /** Actions bổ sung */
  extraActions?: ReactNode;
  /** Đang loading */
  isLoading?: boolean;
  /** Custom class */
  className?: string;
}

/**
 * Floating Action Bar hiển thị khi có rows được chọn
 *
 * @example
 * ```tsx
 * <TableActionBar
 *   selectedCount={selection.selectedCount}
 *   onDelete={handleBulkDelete}
 *   onDeselectAll={selection.clearAll}
 * />
 * ```
 */
export function TableActionBar({
  selectedCount,
  onDelete,
  onExport,
  onDeselectAll,
  deleteLabel = "Xóa",
  exportLabel = "Xuất",
  extraActions,
  isLoading = false,
  className,
}: TableActionBarProps) {
  // Không hiển thị nếu không có item nào được chọn
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        // Positioning
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        // Appearance
        "bg-background/95 rounded-lg border shadow-lg backdrop-blur-sm",
        // Layout
        "flex items-center gap-4 px-5 py-3",
        // Animation
        "animate-in slide-in-from-bottom-4 fade-in-0 duration-300",
        className
      )}
    >
      {/* Selected count */}
      <span className="whitespace-nowrap text-sm font-medium">
        Đã chọn{" "}
        <span className="text-primary font-semibold">{selectedCount}</span> mục
      </span>

      {/* Separator */}
      <div className="bg-border h-5 w-px" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Export */}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isLoading}
            className="h-8"
          >
            <Download className="mr-1.5 size-4" />
            {exportLabel}
          </Button>
        )}

        {/* Delete */}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
            className="h-8"
          >
            <Trash2 className="mr-1.5 size-4" />
            {deleteLabel}
          </Button>
        )}

        {/* Extra actions */}
        {extraActions}
      </div>

      {/* Separator */}
      <div className="bg-border h-5 w-px" />

      {/* Deselect */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDeselectAll}
        disabled={isLoading}
        className="text-muted-foreground hover:text-foreground h-8"
      >
        <X className="mr-1 size-4" />
        Bỏ chọn
      </Button>
    </div>
  );
}
