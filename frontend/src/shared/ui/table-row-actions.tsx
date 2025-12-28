"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import * as React from "react";

interface TableRowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  label?: string;
}

/**
 * Dropdown menu cho các hàng trong bảng (DataTable).
 * Chứa các hành động mặc định: Sửa, Xóa.
 */
export function TableRowActions({
  onEdit,
  onDelete,
  children,
  label = "Thao tác",
}: TableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {label && (
          <>
            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Chỉnh sửa
          </DropdownMenuItem>
        )}

        {children}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Xóa dữ liệu
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
