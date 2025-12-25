import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, MapPin, Phone, User } from "lucide-react";
import { formatDuration } from "@/shared/lib/utils";

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
 * Bao gồm: Thời gian, Khách hàng, KTV, Giường, Ghi chú
 */
export function AppointmentViewContent({
  event,
  appointment,
}: AppointmentViewContentProps) {
  return (
    <div className="space-y-6">
      {/* Thời gian */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Calendar className="size-4" />
          Thời gian
        </h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-lg font-semibold">
            {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
          </div>
          <div className="text-muted-foreground text-sm">
            {format(event.start, "EEEE, d MMMM yyyy", { locale: vi })}
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            <Clock className="inline h-3.5 w-3.5" />
            {formatDuration(appointment.duration)}
          </div>
        </div>
      </div>

      <Separator />

      {/* Khách hàng */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <User className="size-4" />
          Khách hàng
        </h3>
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold">
            {getInitials(appointment.customerName)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{appointment.customerName}</div>
            {appointment.customerPhone && (
              <a
                href={`tel:${appointment.customerPhone}`}
                className="text-primary mt-1 flex items-center gap-1 text-sm hover:underline"
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
        <h3 className="text-muted-foreground text-sm font-medium">
          Kỹ thuật viên
        </h3>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white"
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
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4" />
              Giường
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
            <h3 className="text-muted-foreground text-sm font-medium">
              Ghi chú
            </h3>
            <p className="bg-muted/50 rounded-lg p-3 text-sm">
              {appointment.notes}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
