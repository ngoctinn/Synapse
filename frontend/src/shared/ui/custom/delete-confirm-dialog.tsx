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
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface DeleteConfirmDialogProps {
  /** Dialog có đang mở không */
  open: boolean;

  /** Handler khi dialog đóng/mở */
  onOpenChange: (open: boolean) => void;

  /** Handler khi confirm xóa */
  onConfirm: () => void;

  /** Có đang xóa không (hiển thị loading) */
  isDeleting?: boolean;

  /** Tiêu đề dialog */
  title?: string;

  /** Mô tả/cảnh báo */
  description?: ReactNode;

  /** Tên entity để hiển thị (VD: "nhân viên", "dịch vụ") */
  entityName?: string;

  /** Tên cụ thể của entity đang xóa (VD: "Nguyễn Văn A") */
  entityLabel?: string;

  /** Text cho nút Cancel */
  cancelText?: string;

  /** Text cho nút Confirm */
  confirmText?: string;

  /** Thông tin bổ sung (warnings) */
  additionalWarning?: ReactNode;
}

/**
 * Generic Delete Confirmation Dialog component.
 * Dùng cho tất cả các dialog xác nhận xóa trong ứng dụng.
 *
 * @example
 * ```tsx
 * // Sử dụng với useDeleteAction
 * const { handleDelete, dialogProps } = useDeleteAction({
 *   deleteAction: deleteStaff,
 *   entityName: "nhân viên",
 * })
 *
 * <DeleteConfirmDialog
 *   {...dialogProps}
 *   onConfirm={() => handleDelete(staff.id)}
 *   entityName="nhân viên"
 *   entityLabel={staff.name}
 *   additionalWarning="Các lịch làm việc sẽ bị hủy."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Sử dụng độc lập
 * <DeleteConfirmDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   onConfirm={handleDelete}
 *   isDeleting={isPending}
 *   title="Xóa dịch vụ?"
 *   description="Bạn có chắc chắn muốn xóa dịch vụ này?"
 * />
 * ```
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  title,
  description,
  entityName = "mục này",
  entityLabel,
  cancelText = "Hủy bỏ",
  confirmText,
  additionalWarning,
}: DeleteConfirmDialogProps) {
  // Tạo title mặc định nếu không có
  const dialogTitle = title || `Bạn có chắc chắn muốn xóa ${entityName}?`;

  // Tạo description mặc định nếu không có
  const dialogDescription = description || (
    <>
      Hành động này không thể hoàn tác.
      {entityLabel && (
        <>
          {" "}
          <strong className="text-foreground">{entityLabel}</strong>
        </>
      )}
      {entityLabel
        ? " sẽ bị xóa vĩnh viễn khỏi hệ thống."
        : ` ${entityName} sẽ bị xóa vĩnh viễn khỏi hệ thống.`}
      {additionalWarning && (
        <>
          <br />
          <br />
          {additionalWarning}
        </>
      )}
    </>
  );

  // Text cho nút confirm
  const buttonText = confirmText || `Xóa ${entityName}`;
  const loadingText = `Đang xóa...`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{dialogDescription}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              buttonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
