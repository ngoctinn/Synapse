"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
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
        // Fade in khi hover row (group được set ở AnimatedTableRow)
        "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        className
      )}
    >
      {/* Quick Edit Button */}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 hover:text-primary h-8 w-8"
          onClick={onEdit}
          disabled={disabled}
          title={editLabel}
        >
          <span className="sr-only">{editLabel}</span>
          <Icon icon={Pencil} />
        </Button>
      )}

      {/* Quick Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8"
          onClick={onDelete}
          disabled={disabled}
          title={deleteLabel}
        >
          <span className="sr-only">{deleteLabel}</span>
          <Icon icon={Trash2} />
        </Button>
      )}

      {/* Dropdown Menu cho Extra Actions */}
      {hasExtraActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted h-8 w-8"
              disabled={disabled}
            >
              <span className="sr-only">Mở menu</span>
              <Icon icon={MoreHorizontal} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {extraActions}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Fallback: Nếu không có quick actions, chỉ có more button */}
      {!hasQuickActions && !hasExtraActions && (
        <span className="text-muted-foreground text-xs">-</span>
      )}
    </div>
  );
}
