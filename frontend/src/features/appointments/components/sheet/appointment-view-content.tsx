import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import { Separator } from "@/shared/ui";

import type { Appointment, CalendarEvent } from "../../model/types";

// HELPERS
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AppointmentViewContentProps {
  event: CalendarEvent;
  appointment: Appointment;
}

/**
 * Nội dung chi tiết lịch hẹn trong View Mode
 * Bao gồm: Thời gian, Khách hàng, KTV, Phòng, Ghi chú
 */
export function AppointmentViewContent({ event, appointment }: AppointmentViewContentProps) {
  return (
    <div className="space-y-6">
      {/* Thời gian */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="size-4" />
          Thời gian
        </h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-lg font-semibold">
            {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(event.start, "EEEE, d MMMM yyyy", { locale: vi })}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <Clock className="h-3.5 w-3.5 inline mr-1" />
            {appointment.duration} phút
          </div>
        </div>
      </div>

      <Separator />

      {/* Khách hàng */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <User className="size-4" />
          Khách hàng
        </h3>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {getInitials(appointment.customerName)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{appointment.customerName}</div>
            {appointment.customerPhone && (
              <a
                href={`tel:${appointment.customerPhone}`}
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                <Phone className="h-3.5 w-3.5" />
                {appointment.customerPhone}
              </a>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Kỹ thuật viên */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Kỹ thuật viên
        </h3>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
            style={{ backgroundColor: event.color }}
          >
            {getInitials(event.staffName)}
          </div>
          <span className="font-medium">{event.staffName}</span>
        </div>
      </div>

      {/* Phòng / Giường */}
      {appointment.resourceName && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="size-4" />
              Phòng / Giường
            </h3>
            <div className="font-medium">{appointment.resourceName}</div>
          </div>
        </>
      )}

      {/* Ghi chú */}
      {appointment.notes && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Ghi chú
            </h3>
            <p className="text-sm bg-muted/50 rounded-lg p-3">
              {appointment.notes}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
