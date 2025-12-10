"use client";

import { useReducedMotion } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
 * Status Map sử dụng CSS Variables từ globals.css
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
    const prefersReducedMotion = useReducedMotion();

    if (!appointment) return null;

    const statusInfo = statusMap[appointment.status] || statusMap.pending;

    const transitionClass = prefersReducedMotion ? "" : "transition-colors duration-200";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                        <Badge
                             variant={statusInfo.variant}
                             className={cn("px-2.5 py-0.5 font-medium border", statusInfo.className)}
                        >
                            {statusInfo.label}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Header Info */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarFallback className="text-lg">
                                {appointment.customerName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-none">{appointment.customerName}</h2>
                            {appointment.customerPhone && (
                                <p className="text-sm text-muted-foreground">{appointment.customerPhone}</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Time Column */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Thời gian</p>
                                <p className="text-sm font-medium mt-1">
                                    {format(appointment.startTime, "EEEE, dd/MM", { locale: vi })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}
                                </p>
                            </div>
                        </div>

                         {/* Service Column */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Dịch vụ</p>
                                <p className="text-sm font-medium mt-1">{appointment.serviceName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {appointment.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointment.price) : "Chưa báo giá"}
                                </p>
                            </div>
                        </div>

                         {/* Resource Column */}
                        <div className="col-span-2 space-y-3 pt-2">
                             <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Kỹ thuật viên</p>
                                <div className="flex items-center gap-2 mt-1 p-2 bg-muted/40 rounded-md border border-border/50">
                                     <Avatar className="h-6 w-6 border">
                                        <AvatarImage src={resource?.avatar} />
                                        <AvatarFallback className="text-[10px]">{resource?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium leading-none">{resource?.name || "Chưa chọn"}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">{resource?.role || "—"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                         {appointment.notes && (
                             <div className="col-span-2 mt-2">
                                <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Ghi chú</p>
                                    <p className="text-sm text-foreground/80 italic">
                                        "{appointment.notes}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex flex-row justify-between sm:justify-between items-center gap-2 pt-2 border-t mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel?.(appointment)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -ml-2 h-8 px-3"
                        aria-label="Hủy lịch hẹn"
                    >
                        Hủy lịch hẹn
                    </Button>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm" className="h-8">Đóng</Button>
                        </DialogClose>
                        <Button
                            onClick={() => onEdit?.(appointment)}
                            size="sm"
                            className={cn("h-8 bg-primary hover:bg-primary/90", transitionClass)}
                            aria-label="Chỉnh sửa lịch hẹn"
                        >
                            Chỉnh sửa
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
