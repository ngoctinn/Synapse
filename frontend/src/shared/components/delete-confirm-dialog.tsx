import { ConfirmDialog } from "./confirm-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  entityName: string;
  entityLabel?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  entityName,
  entityLabel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  const description = entityLabel
    ? `Bạn có chắc chắn muốn xóa ${entityName} "${entityLabel}" không?`
    : `Bạn có chắc chắn muốn xóa ${entityName} này không?`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Xóa ${entityName}?`}
      description={`${description} Hành động này không thể hoàn tác.`}
      confirmText="Xóa"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
