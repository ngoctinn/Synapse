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
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Kiểu xác nhận để quyết định màu sắc và icon
 */
export type ConfirmVariant = "warning" | "destructive" | "info";

interface ConfirmDialogProps {
  /** Trạng thái đóng/mở */
  open: boolean;
  /** Callback khi thay đổi trạng thái */
  onOpenChange: (open: boolean) => void;
  /** Callback khi nhấn xác nhận */
  onConfirm: () => void;
  /** Callback khi nhấn hủy */
  onCancel?: () => void;
  /** Tiêu đề hội thoại */
  title: string;
  /** Nội dung chi tiết */
  description: string;
  /** Nhãn nút xác nhận (Mặc định: "Xác nhận") */
  confirmText?: string;
  /** Nhãn nút hủy (Mặc định: "Hủy") */
  cancelText?: string;
  /** Biến thể hiển thị */
  variant?: ConfirmVariant;
  /** Trạng thái đang xử lý (vô hiệu hóa nút) */
  isLoading?: boolean;
}

/**
 * ConfirmDialog: Component xác nhận chuẩn cho toàn dự án.
 * Được thiết kế dựa trên AlertDialog nhưng tối ưu cho việc tái sử dụng.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "warning",
  isLoading = false,
}: ConfirmDialogProps) {

  // Lấy icon tương ứng với variant
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="size-5 text-destructive" />;
      case "info":
        return <Info className="size-5 text-blue-500" />;
      default:
        return <AlertTriangle className="size-5 text-warning" />;
    }
  };



  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-full",
              variant === "destructive" ? "bg-destructive/10" :
              variant === "info" ? "bg-primary/10" : "bg-warning/10"
            )}>
              {getIcon()}
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={onCancel}
            className="flex-1"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            variant={variant === "destructive" ? "destructive" : variant === "warning" ? "warning" : "default"}
            className="flex-1"
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
