import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Separator,
} from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";

// Billing components
import { InvoiceDetails } from "@/features/billing/components/sheet/invoice-details";
import { PaymentForm } from "@/features/billing/components/sheet/payment-form";
import { Invoice } from "@/features/billing/model/types";

import { ReviewPrompt } from "@/features/reviews/components/review-prompt";
import { STATUS_TO_BADGE_PRESET } from "../../constants";
import { MockService } from "../../model/mocks";
import type {
  Appointment,
  CalendarEvent,
  TimelineResource,
} from "../../model/types";
import { AppointmentForm } from "./appointment-form";
import {
  FormModeFooter,
  PaymentModeFooter,
  ViewModeFooter,
} from "./appointment-sheet-footer";
import { AppointmentViewContent } from "./appointment-view-content";

// ============================================
// TYPES
// ============================================

type SheetMode = "view" | "edit" | "create" | "payment";

interface AppointmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: SheetMode;
  event?: CalendarEvent | null;
  onSave?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
  onCheckIn?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCreateInvoice?: (id: string) => Promise<Invoice | null>;
  onPaymentSuccess?: (bookingId: string) => void;
  onReviewNeeded?: (bookingId: string) => void;
  defaultValues?: {
    date?: Date;
    startTime?: string;
    staffId?: string;
  };
  availableStaff: TimelineResource[];
  availableResources: TimelineResource[];
  availableServices: MockService[];
}

// ============================================
// COMPONENT
// ============================================

export function AppointmentSheet({
  open,
  onOpenChange,
  mode: initialMode = "view",
  event,
  onSave,
  onDelete: _onDelete,
  onCheckIn,
  onCancel,
  onCreateInvoice,
  onPaymentSuccess,
  onReviewNeeded,
  defaultValues,
  availableStaff,
  availableResources,
  availableServices,
}: AppointmentSheetProps) {
  const [mode, setMode] = useState<SheetMode>(initialMode);
  const [reviewPromptOpen, setReviewPromptOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const appointment = event?.appointment;

  const isCreateMode = mode === "create" || !appointment;
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view" && !!appointment;
  const isPaymentMode = mode === "payment" && !!invoice;

  // Trigger review prompt for completed appointments
  useEffect(() => {
    if (open && isViewMode && appointment?.status === "COMPLETED") {
      onReviewNeeded?.(appointment.id);
    }
  }, [open, isViewMode, appointment?.status, appointment?.id, onReviewNeeded]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleClose = (newOpen?: boolean | unknown) => {
    // Nếu được gọi từ ActionSheet onOpenChange(false), newOpen sẽ là false
    if (newOpen === true) return;

    onOpenChange(false);
    // Reset dirty state
    setIsDirty(false);

    setTimeout(() => {
      setMode(initialMode);
      setReviewPromptOpen(false);
      setInvoice(null);
      setIsCreatingInvoice(false);
    }, 300);
  };

  const handleEdit = () => setMode("edit");
  const handleCancelEdit = () => setMode("view");

  const handleSave = (apt: Appointment) => {
    onSave?.(apt);
    setMode("view");
  };

  const handleCreateInvoiceAndPay = async () => {
    if (!appointment?.id || !onCreateInvoice) return;
    setIsCreatingInvoice(true);
    try {
      const createdInvoice = await onCreateInvoice(appointment.id);
      if (createdInvoice) {
        setInvoice(createdInvoice);
        setMode("payment");
      }
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (appointment?.id) {
      onPaymentSuccess?.(appointment.id);
      setReviewPromptOpen(true);
    }
  };

  const handleBackToView = () => {
    setMode("view");
    setInvoice(null);
  };

  // ============================================
  // COMPUTED
  // ============================================

  const canCheckIn =
    appointment?.status === "CONFIRMED" || appointment?.status === "PENDING";
  const canCancel =
    appointment?.status === "PENDING" || appointment?.status === "CONFIRMED";
  const canCreateInvoice = appointment?.status === "COMPLETED";

  const sheetTitle = isCreateMode
    ? "Tạo lịch hẹn mới"
    : isEditMode
      ? "Chỉnh sửa lịch hẹn"
      : isPaymentMode
        ? "Thanh toán hóa đơn"
        : "Chi tiết lịch hẹn";

  // ============================================
  // RENDER
  // ============================================

  return (
    <ActionSheet
      open={open}
      onOpenChange={handleClose}
      isDirty={isDirty}
      title={
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isPaymentMode && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleBackToView}
              >
                <Icon icon={ArrowLeft} />
              </Button>
            )}
            <span>{sheetTitle}</span>
          </div>

          <div className="flex shrink-0 items-center">
            {isViewMode && appointment && (
              <Badge preset={STATUS_TO_BADGE_PRESET[appointment.status]} />
            )}
            {isPaymentMode && invoice && (
              <Badge
                variant={invoice.status === "PAID" ? "success" : "warning"}
              >
                {invoice.status === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
              </Badge>
            )}
          </div>
        </div>
      }
      description="Xem chi tiết và quản lý lịch hẹn"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          {isPaymentMode ? (
            <PaymentModeFooter
              onBackToView={handleBackToView}
              onClose={handleClose}
            />
          ) : isViewMode && appointment ? (
            <ViewModeFooter
              canCheckIn={canCheckIn}
              canCancel={canCancel}
              canCreateInvoice={canCreateInvoice}
              isCreatingInvoice={isCreatingInvoice}
              appointmentId={appointment.id}
              onCheckIn={onCheckIn}
              onCancel={onCancel}
              onCreateInvoiceAndPay={handleCreateInvoiceAndPay}
              onEdit={handleEdit}
              onClose={handleClose}
            />
          ) : (
            <FormModeFooter
              isEditMode={isEditMode}
              onCancelEdit={handleCancelEdit}
              onClose={handleClose}
            />
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {isCreateMode || isEditMode ? (
          <div className="space-y-6">
            <AppointmentForm
              appointment={appointment}
              defaultValues={defaultValues}
              onSubmit={handleSave}
              availableStaff={availableStaff}
              availableResources={availableResources}
              availableServices={availableServices}
              onDirtyChange={setIsDirty}
            />
          </div>
        ) : isPaymentMode && invoice ? (
          <div className="space-y-6">
            <InvoiceDetails invoice={invoice} />
            <Separator />
            <PaymentForm invoice={invoice} onSuccess={handlePaymentSuccess} />
          </div>
        ) : event && appointment ? (
          <AppointmentViewContent event={event} appointment={appointment} />
        ) : null}
      </div>

      {/* Review Prompt stays as is, separate component */}
      {appointment && (
        <ReviewPrompt
          bookingId={appointment.id}
          open={reviewPromptOpen}
          onOpenChange={setReviewPromptOpen}
          onReviewSubmitted={handleClose}
          customerName={appointment.customerName || ""}
          serviceName={appointment.serviceName || ""}
        />
      )}
    </ActionSheet>
  );
}
