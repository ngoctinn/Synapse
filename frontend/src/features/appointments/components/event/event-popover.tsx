"use client";

/**
 * EventPopover - Popover hiển thị thông tin nhanh khi hover/click event
 *
 * Quick info: Khách, SĐT, Dịch vụ, KTV
 * Quick actions: Xem, Sửa, Check-in, No-Show, Hủy
 */

import { differenceInMinutes, format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MoreHorizontal,
  Phone,
  Trash2,
  User,
  UserX,
  XCircle,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@/shared/ui";

import { APPOINTMENT_STATUS_CONFIG } from "../../constants";
import type { CalendarEvent } from "../../model/types";

interface EventPopoverProps {
  event: CalendarEvent;
  children: React.ReactNode;
  /** Callback xem chi tiết */
  onView?: () => void;
  /** Callback sửa */
  onEdit?: () => void;
  /** Callback check-in */
  onCheckIn?: () => void;
  /** Callback đánh dấu No-Show */
  onNoShow?: () => void;
  /** Callback hủy */
  onCancel?: () => void;
  /** Callback xóa */
  onDelete?: () => void;
  /** Có mở popover không */
  open?: boolean;
  /** Callback khi đổi trạng thái mở */
  onOpenChange?: (open: boolean) => void;
}

export function EventPopover({
  event,
  children,
  onView,
  onEdit,
  onCheckIn,
  onNoShow,
  onCancel,
  onDelete,
  open,
  onOpenChange,
}: EventPopoverProps) {
  const statusConfig = APPOINTMENT_STATUS_CONFIG[event.status];
  const timeRange = `${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`;
  const dateStr = format(event.start, "EEEE, d MMMM yyyy", { locale: vi });

  const now = new Date();
  const minutesUntilStart = differenceInMinutes(event.start, now);
  const minutesSinceStart = differenceInMinutes(now, event.start);

  // Check-in: Khách có thể check-in từ 15 phút trước đến 30 phút sau giờ hẹn
  const canCheckIn =
    event.status === "CONFIRMED" &&
    minutesUntilStart <= 15 &&
    minutesSinceStart <= 30;

  // No-Show: Nếu đã quá 15 phút sau giờ hẹn mà vẫn chưa check-in
  const canMarkNoShow = event.status === "CONFIRMED" && minutesSinceStart > 15;

  // Cancel: Chỉ có thể hủy pending hoặc confirmed
  const canCancel = event.status === "PENDING" || event.status === "CONFIRMED";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
        {/* Header với màu dịch vụ */}
        <div
          className="rounded-t-lg p-4"
          style={{ backgroundColor: event.color + "15" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Service Name */}
              <h4
                className="text-base font-semibold leading-tight"
                style={{ color: event.color }}
              >
                {event.appointment.serviceName}
              </h4>

              {/* Status Badge */}
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                  statusConfig.bgColor,
                  statusConfig.color
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "currentColor" }}
                />
                {statusConfig.label}
              </div>
            </div>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Calendar className="size-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="size-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canCheckIn && (
                  <DropdownMenuItem
                    onClick={onCheckIn}
                    className="text-emerald-600"
                  >
                    <CheckCircle2 className="size-4" />
                    Check-in khách
                  </DropdownMenuItem>
                )}
                {canMarkNoShow && (
                  <DropdownMenuItem
                    onClick={onNoShow}
                    className="text-gray-600"
                  >
                    <UserX className="size-4" />
                    Đánh dấu không đến
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <DropdownMenuItem
                    onClick={onCancel}
                    className="text-amber-600"
                  >
                    <XCircle className="size-4" />
                    Hủy lịch hẹn
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="size-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Time */}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="text-muted-foreground size-4 flex-shrink-0" />
            <div>
              <div className="font-medium">{timeRange}</div>
              <div className="text-muted-foreground text-xs">{dateStr}</div>
            </div>
          </div>

          {/* Customer */}
          <div className="flex items-start gap-3 text-sm">
            <User className="text-muted-foreground mt-0.5 size-4 flex-shrink-0" />
            <div>
              <div className="font-medium">
                {event.appointment.customerName}
              </div>
              {event.appointment.customerPhone && (
                <a
                  href={`tel:${event.appointment.customerPhone}`}
                  className="text-primary flex items-center gap-1 text-xs hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {event.appointment.customerPhone}
                </a>
              )}
            </div>
          </div>

          {/* Staff */}
          <div className="flex items-center gap-3 text-sm">
            <div
              className="h-4 w-4 flex-shrink-0 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <span>{event.staffName}</span>
          </div>

          {/* Resource (if any) */}
          {event.appointment.resourceName && (
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <span className="text-base">📍</span>
              <span>{event.appointment.resourceName}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer Actions */}
        <div className="flex items-center gap-2 p-3">
          {canCheckIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onView}
              >
                Xem chi tiết
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={onCheckIn}
              >
                <CheckCircle2 className="mr-1.5 size-4" />
                Check-in
              </Button>
            </>
          ) : canMarkNoShow ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onView}
              >
                Xem chi tiết
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={onNoShow}
              >
                <UserX className="mr-1.5 size-4" />
                Không đến
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onView}
              >
                Xem chi tiết
              </Button>
              <Button size="sm" className="flex-1" onClick={onEdit}>
                Chỉnh sửa
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
