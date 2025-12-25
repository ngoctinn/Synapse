"use client";

import { Appointment, AppointmentStatus } from "@/features/appointments";
import { useReducedMotion } from "@/shared/hooks";
import { formatDuration } from "@/shared/lib/utils";
import { Badge, BadgePreset } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, Variants } from "framer-motion";
import { Calendar, MapPin, User } from "lucide-react";

interface AppointmentListProps {
  appointments: Appointment[];
}

// Map status to Badge preset (handles both uppercase and lowercase)
const getStatusPreset = (status: string): BadgePreset => {
  const normalized = status.toUpperCase() as AppointmentStatus;
  const presetMap: Record<AppointmentStatus, BadgePreset> = {
    PENDING: "appointment-pending",
    CONFIRMED: "appointment-confirmed",
    IN_PROGRESS: "appointment-in-progress",
    COMPLETED: "appointment-completed",
    CANCELLED: "appointment-cancelled",
    NO_SHOW: "appointment-no-show",
  };
  return presetMap[normalized] || "appointment-pending";
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AppointmentList({ appointments }: AppointmentListProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleCancelClick = (appointment: Appointment) => {
    // Chức năng hủy lịch sẽ được tích hợp khi connect với API backend
    // Hiện tại chỉ hiển thị nút, chưa có action thực tế
    void appointment; // Placeholder để tránh unused warning
  };

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar
          className="text-muted-foreground/50 h-12 w-12"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-lg font-semibold">Chưa có lịch hẹn</h3>
        <p className="text-muted-foreground">
          Bạn chưa đặt lịch hẹn nào gần đây.
        </p>
      </div>
    );
  }

  // Conditional rendering based on motion preference
  const MotionContainer = prefersReducedMotion ? "div" : motion.div;
  const MotionItem = prefersReducedMotion ? "div" : motion.div;

  const containerProps = prefersReducedMotion
    ? {}
    : {
        variants: containerVariants,
        initial: "hidden" as const,
        animate: "show" as const,
      };

  const itemProps = prefersReducedMotion
    ? {}
    : {
        variants: itemVariants,
      };

  return (
    <>
      <MotionContainer
        {...containerProps}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      >
        {appointments.map((appt) => (
          <MotionItem key={appt.id} {...itemProps}>
            <Card className="hover:border-primary/50 focus-within:ring-primary group h-full overflow-hidden transition-all duration-200 focus-within:ring-2 hover:shadow-md">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge
                      preset={getStatusPreset(appt.status)}
                      className="mb-2"
                    />
                    <CardTitle className="group-hover:text-primary text-base font-bold leading-tight transition-colors">
                      {appt.serviceName}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 text-sm">
                <div className="text-muted-foreground flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <Calendar className="size-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">
                      {format(new Date(appt.startTime), "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </span>
                    <span className="text-xs">
                      {format(new Date(appt.startTime), "HH:mm")} ({formatDuration(appt.duration)})
                    </span>
                  </div>
                </div>

                {appt.resourceName && (
                  <div className="text-muted-foreground flex items-center gap-3">
                    <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
                      <MapPin className="size-4" aria-hidden="true" />
                    </div>
                    <span>{appt.resourceName || "Chưa xếp giường"}</span>
                  </div>
                )}

                {appt.staffName && (
                  <div className="text-muted-foreground flex items-center gap-3">
                    <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="size-4" aria-hidden="true" />
                    </div>
                    <span>KTV: {appt.staffName}</span>
                  </div>
                )}

                <div className="mt-1 flex justify-end gap-2 border-t pt-2">
                  {(appt.status === "PENDING" ||
                    appt.status === "CONFIRMED") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleCancelClick(appt)}
                    >
                      Hủy
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground flex-1 transition-colors"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionItem>
        ))}
      </MotionContainer>
    </>
  );
}
