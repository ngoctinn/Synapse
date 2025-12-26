"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Separator } from "@/shared/ui/separator";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Icon } from "./icon";
import { ReactNode } from "react";

interface TableRowActionsProps {
  /** Handler cho action Edit */
  onEdit?: () => void;
  /** Handler cho action Delete */
  onDelete?: () => void;
  /** Label cho Edit button, mặc định "Sửa" */
  editLabel?: string;
  /** Label cho Delete button, mặc định "Xóa" */
  deleteLabel?: string;
  /** Actions phụ trong dropdown menu */
  extraActions?: ReactNode;
  /** Disable tất cả actions */
  disabled?: boolean;
  /** Custom class cho container */
  className?: string;
}

/**
 * TableRowActions - Component pattern cho actions trên table row
 *
 * Hiển thị inline icon buttons cho Edit/Delete khi hover,
 * và dropdown menu cho các actions phụ.
 *
 * @example
 * ```tsx
 * <TableRowActions
 *   onEdit={() => setEditOpen(true)}
 *   onDelete={() => setDeleteOpen(true)}
 *   extraActions={
 *     <DropdownMenuItem onClick={handleClone}>
 *       <Copy className="size-4" />
 *       Nhân bản
 *     </DropdownMenuItem>
 *   }
 * />
 * ```
 */
export function TableRowActions({
  onEdit,
  onDelete,
  editLabel = "Sửa",
  deleteLabel = "Xóa",
  extraActions,
  disabled = false,
  className,
}: TableRowActionsProps) {
  const hasQuickActions = onEdit || onDelete;
  const hasExtraActions = !!extraActions;

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-1",
        // Fix Issue #4: Use visibility instead of opacity for better performance
        // Only visible on hover, but always in DOM for consistent layout
        "invisible group-hover:visible transition-[visibility] duration-150",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 hover:bg-muted"
            disabled={disabled}
          >
            <span className="sr-only">Mở menu</span>
            <Icon icon={MoreHorizontal} className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit} disabled={disabled}>
              <Icon icon={Pencil} className="mr-2 size-4" />
              <span>{editLabel}</span>
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={onDelete}
              disabled={disabled}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Icon icon={Trash2} className="mr-2 size-4" />
              <span>{deleteLabel}</span>
            </DropdownMenuItem>
          )}
          {extraActions && (
            <>
              {hasQuickActions && <Separator className="my-1" />}
              {extraActions}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fallback: Nếu không có quick actions, chỉ có more button */}
      {!hasQuickActions && !hasExtraActions && (
        <span className="text-muted-foreground text-xs" aria-hidden="true">-</span>
      )}
    </div>
  );
}
