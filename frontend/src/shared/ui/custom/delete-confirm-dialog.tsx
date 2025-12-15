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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: ReactNode;
  entityName?: string;
  entityLabel?: string;
  cancelText?: string;
  confirmText?: string;
  additionalWarning?: ReactNode;
}

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
  const dialogTitle = title || `Bạn có chắc chắn muốn xóa ${entityName}?`;
  const buttonText = confirmText || `Xóa ${entityName}`;

  const defaultDescription = (
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px] p-6 gap-6 border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="rounded-full p-3 mb-2 bg-destructive/10 animate-pulse-subtle">
            <AlertTriangle className="h-6 w-6 text-destructive" strokeWidth={2.5} />
          </div>

          <AlertDialogHeader className="gap-2 sm:text-center">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-center">
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
              {description || defaultDescription}
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
                Đang xóa...
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
