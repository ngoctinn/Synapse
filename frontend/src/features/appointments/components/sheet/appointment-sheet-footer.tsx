import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Edit,
    XCircle,
} from "lucide-react";

import { Button, SheetFooter } from "@/shared/ui";

interface ViewModeFooterProps {
  canCheckIn: boolean;
  canCancel: boolean;
  canCreateInvoice: boolean;
  isCreatingInvoice: boolean;
  appointmentId: string;
  onCheckIn?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCreateInvoiceAndPay: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export function ViewModeFooter({
  canCheckIn,
  canCancel,
  canCreateInvoice,
  isCreatingInvoice,
  appointmentId,
  onCheckIn,
  onCancel,
  onCreateInvoiceAndPay,
  onEdit,
  onClose,
}: ViewModeFooterProps) {
  return (
    <SheetFooter className="px-6 py-3 border-t bg-background flex-col gap-3 z-20">
      {/* Tạo hóa đơn */}
      {canCreateInvoice && (
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="success"
            className="w-full h-9"
            onClick={onCreateInvoiceAndPay}
            disabled={isCreatingInvoice}
            isLoading={isCreatingInvoice}
            startContent={!isCreatingInvoice && <CreditCard className="size-4" />}
          >
            Tạo hóa đơn & Thanh toán
          </Button>
        </div>
      )}

      {/* Check-in / Hủy */}
      <div className="flex items-center gap-2 w-full">
        {canCheckIn && (
          <Button
            variant="outline-success"
            className="flex-1 h-9"
            onClick={() => onCheckIn?.(appointmentId)}
            startContent={<CheckCircle2 className="size-4" />}
          >
            Check-in
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outline-warning"
            className="flex-1 h-9"
            onClick={() => onCancel?.(appointmentId)}
            startContent={<XCircle className="size-4" />}
          >
            Hủy lịch
          </Button>
        )}
      </div>

      {/* Đóng / Chỉnh sửa */}
      <div className="flex items-center gap-2 w-full">
        <Button variant="ghost" className="flex-1 h-9" onClick={onClose}>
          Đóng
        </Button>
        <Button
          className="flex-1 h-9"
          onClick={onEdit}
          startContent={<Edit className="size-4" />}
        >
          Chỉnh sửa
        </Button>
      </div>
    </SheetFooter>
  );
}

interface PaymentModeFooterProps {
  onBackToView: () => void;
  onClose: () => void;
}

export function PaymentModeFooter({ onBackToView, onClose }: PaymentModeFooterProps) {
  return (
    <SheetFooter className="px-6 py-3 border-t bg-background flex-col gap-3 z-20">
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1 h-9"
          onClick={onBackToView}
          startContent={<ArrowLeft className="size-4" />}
        >
          Quay lại
        </Button>
        <Button variant="ghost" className="flex-1 h-9" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </SheetFooter>
  );
}

interface FormModeFooterProps {
  isEditMode: boolean;
  onCancelEdit: () => void;
  onClose: () => void;
}

export function FormModeFooter({ isEditMode, onCancelEdit, onClose }: FormModeFooterProps) {
  return (
    <SheetFooter className="px-6 py-3 border-t bg-background flex-col gap-3 z-20">
      <div className="flex items-center gap-3 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={isEditMode ? onCancelEdit : onClose}
          className="flex-1 h-9"
        >
          Hủy bỏ
        </Button>
        <Button type="submit" form="appointment-form" className="flex-1 h-9">
          {isEditMode ? "Lưu thay đổi" : "Tạo lịch hẹn"}
        </Button>
      </div>
    </SheetFooter>
  );
}
