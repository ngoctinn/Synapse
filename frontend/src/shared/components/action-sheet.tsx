"use client";

import { cn } from "@/shared/lib/utils";
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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import * as React from "react";

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isPending?: boolean;
  /** Form có thay đổi chưa lưu không? Nếu có sẽ hiện cảnh báo khi đóng */
  isDirty?: boolean;
  /** Bật/tắt tính năng cảnh báo thay đổi (Mặc định: true) */
  showUnsavedChangesWarning?: boolean;
  size?: "default" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

/**
 * ActionSheet là một wrapper cao cấp cho Sheet component,
 * giúp giảm boilerplate code và đảm bảo tuân thủ UX Spec của dự án.
 *
 * Tính năng tích hợp:
 * - Tự động tạo cấu trúc Header, Body (scrollable), Footer (sticky).
 * - Hỗ trợ preventClose khi đang isPending.
 * - Hỗ trợ đa dạng kích thước qua prop size.
 */
export function ActionSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  isPending = false,
  isDirty = false,
  showUnsavedChangesWarning = true,
  size = "default",
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: ActionSheetProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Xử lý khi người dùng yêu cầu thay đổi trạng thái đóng/mở
  const handleOpenChange = (newOpen: boolean) => {
    // 1. Luôn cho phép mở
    if (newOpen) {
      onOpenChange(true);
      return;
    }

    // 2. Nếu đang đóng:
    // - Nếu đang xử lý (isPending): Chặn tuyệt đối (đã xử lý bởi preventClose trong SheetContent)
    if (isPending) return;

    // - Nếu có thay đổi chưa lưu và tính năng cảnh báo đang bật: Hiện Dialog xác nhận
    if (isDirty && showUnsavedChangesWarning) {
      setShowConfirm(true);
      return;
    }

    // - Trường hợp bình thường: Đóng ngay
    onOpenChange(false);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          size={size}
          preventClose={isPending}
          className={cn("flex flex-col p-0", className)}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className={headerClassName}>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          <SheetBody className={bodyClassName}>{children}</SheetBody>

          {footer && (
            <SheetFooter className={footerClassName}>{footer}</SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog xác nhận khi có thay đổi chưa lưu */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thay đổi chưa được lưu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có các thay đổi chưa được lưu. Bạn có chắc chắn muốn đóng và
              hủy bỏ các thay đổi này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              variant="destructive"
            >
              Đóng và hủy bỏ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
