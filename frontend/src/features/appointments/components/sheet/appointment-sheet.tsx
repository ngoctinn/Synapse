import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MapPin,
  Phone,
  Receipt,
  User,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react"; // Import useEffect

import { cn } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/shared/ui";

import { ReviewPrompt } from "@/features/reviews/components/review-prompt"; // Import ReviewPrompt
import { APPOINTMENT_STATUS_CONFIG } from "../../constants";
import { MockService } from "../../mock-data";
import type { Appointment, CalendarEvent, TimelineResource } from "../../types";
import { AppointmentForm } from "./appointment-form";

// ============================================
// TYPES
// ============================================

type SheetMode = "view" | "edit" | "create";

interface AppointmentSheetProps {
  /** Có mở sheet không */
  open: boolean;
  /** Callback khi đóng */
  onOpenChange: (open: boolean) => void;
  /** Mode hiện tại */
  mode?: SheetMode;
  /** Event đang xem/sửa (null khi create) */
  event?: CalendarEvent | null;
  /** Callback khi save thành công */
  onSave?: (appointment: Appointment) => void;
  /** Callback khi delete */
  onDelete?: (id: string) => void;
  /** Callback khi check-in */
  onCheckIn?: (id: string) => void;
  /** Callback khi cancel */
  onCancel?: (id: string) => void;
  /** Callback tạo hóa đơn */
  onCreateInvoice?: (id: string) => void;
  /** Callback khi cần đánh giá */
  onReviewNeeded?: (bookingId: string) => void;
  /** Default values cho create mode */
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
  onDelete,
  onCheckIn,
  onCancel,
  onCreateInvoice,
  onReviewNeeded,
  defaultValues,
  availableStaff,
  availableResources,
  availableServices,
}: AppointmentSheetProps) {
  const [mode, setMode] = useState<SheetMode>(initialMode);
  const [reviewPromptOpen, setReviewPromptOpen] = useState(false);

  const appointment = event?.appointment;
  const statusConfig = appointment
    ? APPOINTMENT_STATUS_CONFIG[appointment.status]
    : null;

  const isCreateMode = mode === "create" || !appointment;
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view" && !!appointment;

  // Effect to trigger review prompt if needed
  useEffect(() => {
    if (open && isViewMode && appointment?.status === "completed") {
      // In a real app, you'd check if an invoice is paid and if a review already exists
      // For mock, we just assume it might be needed for completed appointments
      // And let the parent decide when to actually trigger `onReviewNeeded` (after invoice paid)
      // For now, let's keep it simple: if completed, ask parent to check
      onReviewNeeded?.(appointment.id);
    }
  }, [open, isViewMode, appointment?.status, appointment?.id, onReviewNeeded]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset mode sau khi đóng
    setTimeout(() => {
        setMode(initialMode);
        setReviewPromptOpen(false); // Close review prompt on sheet close
    }, 300);
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancelEdit = () => {
    setMode("view");
  };

  const handleSave = (apt: Appointment) => {
    onSave?.(apt);
    setMode("view");
  };

  const canCheckIn =
    appointment?.status === "confirmed" ||
    appointment?.status === "pending";
  const canCancel =
    appointment?.status === "pending" ||
    appointment?.status === "confirmed";
  const canCreateInvoice = appointment?.status === "completed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl">
                {isCreateMode
                  ? "Tạo lịch hẹn mới"
                  : isEditMode
                    ? "Chỉnh sửa lịch hẹn"
                    : "Chi tiết lịch hẹn"}
              </SheetTitle>
              <SheetDescription>
                {isCreateMode
                  ? "Điền thông tin để tạo lịch hẹn"
                  : appointment?.serviceName}
              </SheetDescription>
            </div>

            {/* Status Badge (View mode) */}
            {isViewMode && statusConfig && (
              <Badge
                variant="secondary"
                className={cn(statusConfig.bgColor, statusConfig.color)}
              >
                {statusConfig.label}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* ============================================ */}
        {/* CONTENT */}
        {/* ============================================ */}
        <div className="sheet-scroll-area">
          {(isCreateMode || isEditMode) ? (
            // Form Mode
            <div className="space-y-6">
              <AppointmentForm
                appointment={appointment}
                defaultValues={defaultValues}
                onSubmit={handleSave}
                availableStaff={availableStaff}
                availableResources={availableResources}
                availableServices={availableServices}
              />
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Time Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Thời gian
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-lg font-semibold">
                    {format(event!.start, "HH:mm")} - {format(event!.end, "HH:mm")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(event!.start, "EEEE, d MMMM yyyy", { locale: vi })}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <Clock className="h-3.5 w-3.5 inline mr-1" />
                    {appointment!.duration} phút
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Khách hàng
                </h3>
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
                  >
                    {getInitials(appointment!.customerName)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{appointment!.customerName}</div>
                    {appointment!.customerPhone && (
                      <a
                        href={`tel:${appointment!.customerPhone}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {appointment!.customerPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Staff Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Kỹ thuật viên
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                    style={{ backgroundColor: event!.color }}
                  >
                    {getInitials(event!.staffName)}
                  </div>
                  <span className="font-medium">{event!.staffName}</span>
                </div>
              </div>

              {/* Resource Info */}
              {appointment!.resourceName && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Phòng / Giường
                    </h3>
                    <div className="font-medium">{appointment!.resourceName}</div>
                  </div>
                </>
              )}

              {/* Notes */}
              {appointment!.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Ghi chú
                    </h3>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">
                      {appointment!.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}

        <SheetFooter className="px-6 py-3 border-t bg-background flex-col gap-3 z-20">
          {isViewMode ? (
             <>
                {/* Quick Actions */}
                <div className="flex items-center gap-2 w-full">
                  {canCreateInvoice && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 h-9"
                      onClick={() => onCreateInvoice?.(appointment!.id)}
                      startContent={<Receipt className="size-4" />}
                    >
                      Tạo hóa đơn
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full">
                  {canCheckIn && (
                    <Button
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50 h-9"
                      onClick={() => onCheckIn?.(appointment!.id)}
                      startContent={<CheckCircle2 className="size-4" />}
                    >
                      Check-in
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      variant="outline"
                      className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50 h-9"
                      onClick={() => onCancel?.(appointment!.id)}
                      startContent={<XCircle className="size-4" />}
                    >
                      Hủy lịch
                    </Button>
                  )}
                </div>

                {/* Main Actions */}
                <div className="flex items-center gap-2 w-full">
                  <Button variant="ghost" className="flex-1 h-9" onClick={handleClose}>
                    Đóng
                  </Button>
                  <Button className="flex-1 h-9" onClick={handleEdit} startContent={<Edit className="size-4" />}>
                    Chỉnh sửa
                  </Button>
                </div>
             </>
          ) : (
            // Create / Edit Mode Footer
            <div className="flex items-center gap-3 w-full">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={isEditMode ? handleCancelEdit : handleClose}
                    className="flex-1 h-9 text-muted-foreground hover:text-foreground"
                >
                    Hủy bỏ
                </Button>
                <Button
                    type="submit"
                    form="appointment-form"
                    className="flex-1 h-9"
                >
                    {isEditMode ? "Lưu thay đổi" : "Tạo lịch hẹn"}
                </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Review Prompt */}
      {appointment && (
        <ReviewPrompt
          bookingId={appointment.id}
          open={reviewPromptOpen}
          onOpenChange={setReviewPromptOpen}
          onReviewSubmitted={handleClose} // Close sheet after review
          customerName={appointment.customerName}
          serviceName={appointment.serviceName}
        />
      )}
    </Sheet>
  );
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
