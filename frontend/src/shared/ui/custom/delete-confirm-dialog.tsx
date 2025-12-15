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
import { AlertTriangle, Loader2 } from "lucide-react";
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
      <AlertDialogContent className="sm:max-w-[400px] p-6 gap-6 border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Icon with subtle glow - Consistent with ConfirmDialog */}
          <div className="rounded-full p-3 mb-2 bg-destructive/10 animate-pulse-subtle">
            <AlertTriangle className="h-6 w-6 text-destructive" strokeWidth={2.5} />
          </div>

          <AlertDialogHeader className="gap-2 sm:text-center">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-center">
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <AlertDialogCancel
            disabled={isDeleting}
            className="w-full sm:flex-1 h-10 rounded-xl border-muted-foreground/20 hover:bg-muted/50 hover:text-foreground transition-colors mt-0"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="w-full sm:flex-1 h-10 rounded-xl shadow-lg shadow-destructive/20 transition-all hover:shadow-destructive/30 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
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
