"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

/**
 * Kết quả trả về từ delete action
 */
interface DeleteActionResult {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Options cho useDeleteAction hook
 */
interface UseDeleteActionOptions<TId = string> {
  /** Hàm delete entity */
  deleteAction: (id: TId) => Promise<DeleteActionResult>;

  /** Tên entity để hiển thị trong toast (VD: "nhân viên", "dịch vụ") */
  entityName?: string;

  /** Custom success message */
  successMessage?: string;

  /** Custom error message */
  errorMessage?: string;

  /** Có refresh router sau khi xóa không */
  refreshOnSuccess?: boolean;

  /** Callback sau khi xóa thành công */
  onSuccess?: (result: DeleteActionResult) => void;

  /** Callback khi xóa thất bại */
  onError?: (error: string) => void;
}

/**
 * Return type của useDeleteAction
 */
interface UseDeleteActionReturn<TId = string> {
  /** Có đang xóa không */
  isPending: boolean;

  /** Dialog có đang mở không */
  showDialog: boolean;

  /** Set dialog open state */
  setShowDialog: (open: boolean) => void;

  /** Mở dialog xác nhận xóa */
  openDeleteDialog: () => void;

  /** Đóng dialog */
  closeDeleteDialog: () => void;

  /** Thực hiện xóa */
  handleDelete: (id: TId) => void;

  /** Props để spread vào DeleteConfirmDialog */
  dialogProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
  };
}

/**
 * Custom hook để xử lý delete action với confirmation dialog.
 * Encapsulates: dialog state, delete handler, toast, router refresh.
 *
 * @example
 * ```tsx
 * const { handleDelete, dialogProps, openDeleteDialog } = useDeleteAction({
 *   deleteAction: deleteStaff,
 *   entityName: "nhân viên",
 *   refreshOnSuccess: true,
 * })
 *
 * return (
 *   <>
 *     <Button onClick={openDeleteDialog}>Xóa</Button>
 *     <DeleteConfirmDialog
 *       {...dialogProps}
 *       onConfirm={() => handleDelete(staff.id)}
 *       title="Xóa nhân viên?"
 *       description="Hành động này không thể hoàn tác."
 *     />
 *   </>
 * )
 * ```
 */
export function useDeleteAction<TId = string>(
  options: UseDeleteActionOptions<TId>
): UseDeleteActionReturn<TId> {
  const {
    deleteAction,
    entityName = "mục",
    successMessage,
    errorMessage,
    refreshOnSuccess = true,
    onSuccess,
    onError,
  } = options;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  const openDeleteDialog = useCallback(() => {
    setShowDialog(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setShowDialog(false);
  }, []);

  const handleDelete = useCallback(
    (id: TId) => {
      startTransition(async () => {
        try {
          const result = await deleteAction(id);

          if (result.success) {
            const message =
              successMessage || result.message || `Đã xóa ${entityName}`;
            toast.success(message);
            setShowDialog(false);
            onSuccess?.(result);

            if (refreshOnSuccess) {
              router.refresh();
            }
          } else {
            const error =
              result.error ||
              result.message ||
              errorMessage ||
              `Không thể xóa ${entityName}`;
            toast.error(error);
            onError?.(error);
          }
        } catch (error) {
          const message =
            errorMessage || `Đã có lỗi xảy ra khi xóa ${entityName}`;
          toast.error(message);
          onError?.(message);
          console.error("Delete action error:", error);
        }
      });
    },
    [
      deleteAction,
      entityName,
      successMessage,
      errorMessage,
      refreshOnSuccess,
      router,
      onSuccess,
      onError,
    ]
  );

  return {
    isPending,
    showDialog,
    setShowDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    dialogProps: {
      open: showDialog,
      onOpenChange: setShowDialog,
      isDeleting: isPending,
    },
  };
}
