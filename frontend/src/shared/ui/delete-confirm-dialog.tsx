"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

/**
 * Hộp thoại xác nhận xóa dùng chung.
 * Giúp chuẩn hóa giao diện và hành vi xóa trên toàn hệ thống.
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Xác nhận xóa?",
  description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa hoàn toàn khỏi hệ thống.",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  isPending = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="min-w-[100px]">
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="min-w-[100px]"
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
