"use client";

import { useReducedMotion } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, Edit, FileText, User } from "lucide-react";
import { Appointment, Resource } from "../types";

interface AppointmentDetailDialogProps {
    appointment: Appointment | null;
    /** Thông tin kỹ thuật viên (tùy chọn, nếu không có sẽ hiện "Chưa phân công") */
    resource?: Resource | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (appointment: Appointment) => void;
    onCancel?: (appointment: Appointment) => void;
}

/**
 * Status Map sử dụng CSS Variables từ globals.css để đảm bảo tính nhất quán với theme.
 * Các màu được định nghĩa tại :root và .dark trong globals.css
 */
const statusMap: Record<string, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: {
        label: "Chờ xác nhận",
        className: "bg-[var(--status-pending)] text-[var(--status-pending-foreground)] border-[var(--status-pending-border)]",
        variant: "outline"
    },
    confirmed: {
        label: "Đã xác nhận",
        className: "bg-[var(--status-confirmed)] text-[var(--status-confirmed-foreground)] border-[var(--status-confirmed-border)]",
        variant: "outline"
    },
    serving: {
        label: "Đang phục vụ",
        className: "bg-[var(--status-serving)] text-[var(--status-serving-foreground)] border-[var(--status-serving-border)]",
        variant: "outline"
    },
    completed: {
        label: "Hoàn thành",
        className: "bg-[var(--status-completed)] text-[var(--status-completed-foreground)] border-[var(--status-completed-border)]",
        variant: "outline"
    },
    cancelled: {
        label: "Đã hủy",
        className: "bg-[var(--status-cancelled)] text-[var(--status-cancelled-foreground)] border-[var(--status-cancelled-border)]",
        variant: "outline"
    },
    'no-show': {
        label: "Vắng mặt",
        className: "bg-[var(--status-noshow)] text-[var(--status-noshow-foreground)] border-[var(--status-noshow-border)]",
        variant: "outline"
    },
};

export function AppointmentDetailDialog({
    appointment,
    resource,
    open,
    onOpenChange,
    onEdit,
    onCancel
}: AppointmentDetailDialogProps) {
    // Respect user's motion preferences
    const prefersReducedMotion = useReducedMotion();

    if (!appointment) return null;

    const statusInfo = statusMap[appointment.status] || statusMap.pending;

    // Transition class dựa trên reduced motion preference
    const transitionClass = prefersReducedMotion ? "" : "transition-colors duration-200";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/*
                Responsive & Accessibility improvements:
                - max-h-[90vh] + overflow-y-auto cho mobile scrollability
                - Focus trap handled by Radix Dialog
                - DialogDescription cho screen readers
            */}
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between gap-2 flex-wrap">
                        <span>Chi tiết lịch hẹn</span>
                        <Badge
                            variant={statusInfo.variant}
                            className={statusInfo.className}
                            aria-label={`Trạng thái: ${statusInfo.label}`}
                        >
                            {statusInfo.label}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về lịch hẹn của khách hàng, bao gồm thời gian, dịch vụ và kỹ thuật viên phụ trách.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer Info */}
                    <div className="flex items-start gap-4">
                        <div
                            className="p-2.5 bg-primary/10 rounded-full text-primary flex-shrink-0"
                            aria-hidden="true"
                        >
                            <User className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-sm font-medium leading-none text-muted-foreground">Khách hàng</h4>
                            <p className="font-semibold text-base truncate">{appointment.customerName}</p>
                            <p className="text-xs text-muted-foreground">Mã KH: {appointment.customerId}</p>
                        </div>
                    </div>

                    {/* Time & Service */}
                    <div className="flex items-start gap-4">
                        <div
                            className="p-2.5 bg-[var(--status-confirmed)]/50 rounded-full text-[var(--status-confirmed-foreground)] flex-shrink-0"
                            aria-hidden="true"
                        >
                             <Calendar className="h-5 w-5" />
                        </div>
                         <div className="space-y-1 min-w-0">
                            <h4 className="text-sm font-medium leading-none text-muted-foreground">Thời gian & Dịch vụ</h4>
                            <p className="font-medium">{format(appointment.startTime, "EEEE, dd 'tháng' MM, yyyy", { locale: vi })}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>{format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}</span>
                            </div>
                            <p className="text-sm font-medium text-primary mt-1">{appointment.serviceName}</p>
                        </div>
                    </div>

                    {/* Resource / Technician */}
                     <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border ring-1 ring-border/20 flex-shrink-0">
                            <AvatarImage src={resource?.avatar} alt={resource?.name || "Kỹ thuật viên"} />
                            <AvatarFallback className="text-xs">{resource?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-sm font-medium leading-none text-muted-foreground">Kỹ thuật viên</h4>
                            <p className="font-medium truncate">{resource?.name || "Chưa phân công"}</p>
                            <p className="text-xs text-muted-foreground">{resource?.role || "—"}</p>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="flex items-start gap-4">
                            <div
                                className="p-2.5 bg-muted rounded-full text-muted-foreground flex-shrink-0"
                                aria-hidden="true"
                            >
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="space-y-1 min-w-0">
                                <h4 className="text-sm font-medium leading-none text-muted-foreground">Ghi chú</h4>
                                <p className="text-sm italic text-foreground/80">{appointment.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                     <Button
                        variant="outline"
                        onClick={() => onCancel?.(appointment)}
                        className={cn(
                            "text-destructive hover:text-destructive hover:bg-destructive/10",
                            "focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-2",
                            "active:scale-[0.98]",
                            transitionClass
                        )}
                        aria-label="Hủy lịch hẹn này"
                     >
                        Hủy hẹn
                    </Button>
                    <Button
                        onClick={() => onEdit?.(appointment)}
                        className={cn(
                            "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                            "active:scale-[0.98]",
                            transitionClass
                        )}
                        aria-label="Chỉnh sửa lịch hẹn"
                    >
                        <Edit className="h-4 w-4 mr-2" aria-hidden="true" /> Chỉnh sửa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
