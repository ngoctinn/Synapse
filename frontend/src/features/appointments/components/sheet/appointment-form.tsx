"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React, { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";

import { MultiServiceSelector } from "@/features/appointments/components/selection/multi-service-selector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  showToast,
} from "@/shared/ui";

import { MockService } from "@/features/appointments/model/mocks";
import {
  quickAppointmentFormSchema,
  type QuickAppointmentFormValues,
} from "@/features/appointments/model/schemas";
import type {
  Appointment,
  TimelineResource,
} from "@/features/appointments/model/types";
import {
  useConflictCheck,
  useCustomerSearch,
} from "@/features/appointments/hooks";

import { CustomerPicker } from "./components/customer-picker";
import { AppointmentDateTime } from "./components/appointment-date-time";
import { StaffResourceSelect } from "./components/staff-resource-select";
import { Stack } from "@/shared/ui/layout";

const DEFAULT_SERVICE_COLOR = "#8b5cf6";
const MS_PER_MINUTE = 60000;

// ============================================
// TYPES
// ============================================

interface AppointmentFormProps {
  id?: string;
  appointment?: Appointment | null;
  defaultValues?: {
    date?: Date;
    startTime?: string;
    staffId?: string;
  };
  onSubmit: (appointment: Appointment) => void;
  availableStaff: TimelineResource[];
  availableResources: TimelineResource[];
  availableServices: MockService[];
  onDirtyChange?: (isDirty: boolean) => void;
}

// ============================================
// COMPONENT
// ============================================

export function AppointmentForm({
  id = "appointment-form",
  appointment,
  defaultValues,
  onSubmit,
  availableStaff,
  availableResources,
  availableServices,
  onDirtyChange,
}: AppointmentFormProps) {
  const [isPending, startTransition] = useTransition();

  // Form
  const form = useForm<QuickAppointmentFormValues>({
    resolver: zodResolver(quickAppointmentFormSchema),
    disabled: isPending,
    defaultValues: {
      customerId: appointment?.customerId || "",
      serviceIds: appointment?.serviceId ? [appointment.serviceId] : [],
      staffId: appointment?.staffId || defaultValues?.staffId || "",
      resourceId: appointment?.resourceId || "",
      date: appointment?.startTime || defaultValues?.date || new Date(),
      startTime:
        defaultValues?.startTime ||
        (appointment ? format(appointment.startTime, "HH:mm") : "09:00"),
      notes: appointment?.notes || "",
    },
  });

  // Custom hooks - extracted logic
  const { customerOptions, isSearching, setCustomerSearch } =
    useCustomerSearch();
  const { conflicts, timeWarning, totalDuration } = useConflictCheck({
    form,
    availableServices,
    appointmentId: appointment?.id,
  });

  const isDirty = form.formState.isDirty;

  const lastIsDirty = React.useRef(false);
  React.useEffect(() => {
    if (isDirty !== lastIsDirty.current) {
      onDirtyChange?.(isDirty);
      lastIsDirty.current = isDirty;
    }
  }, [isDirty, onDirtyChange]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = useCallback(
    (values: QuickAppointmentFormValues) => {
      startTransition(() => {
        const [hours, minutes] = values.startTime.split(":").map(Number);
        const startTime = new Date(values.date);
        startTime.setHours(hours, minutes, 0, 0);

        // Data lookup
        const customer = customerOptions.find(
          (c) => c.id === values.customerId
        );
        const staff = availableStaff.find((s) => s.id === values.staffId);
        const service = availableServices.find(
          (s) => s.id === values.serviceIds[0]
        );
        const resource = values.resourceId
          ? availableResources.find((r) => r.id === values.resourceId)
          : undefined;

        const bookingItems = values.serviceIds.map((sId: string) => {
          const s = availableServices.find((as) => as.id === sId);
          return {
            serviceId: sId,
            serviceName: s?.name || "",
            price: s?.price || 0,
            duration: s?.duration || 0,
            startTime,
            staffId: values.staffId,
            resourceId: values.resourceId || undefined,
          };
        });

        const currentTotalDuration = bookingItems.reduce(
          (acc, item) => acc + item.duration,
          0
        );
        const currentTotalPrice = bookingItems.reduce(
          (acc, item) => acc + item.price,
          0
        );
        const finalEndTime = new Date(
          startTime.getTime() + (currentTotalDuration || 60) * MS_PER_MINUTE
        );

        const newAppointment: Appointment = {
          id: appointment?.id || `apt-new-${Date.now()}`,
          customerId: values.customerId,
          customerName: customer?.name || appointment?.customerName || "",
          customerPhone: customer?.phone || appointment?.customerPhone || "",
          items: bookingItems,
          totalPrice: currentTotalPrice,
          totalDuration: currentTotalDuration,
          serviceId: values.serviceIds[0] || "",
          serviceName: service?.name || appointment?.serviceName || "",
          serviceColor: service
            ? DEFAULT_SERVICE_COLOR
            : appointment?.serviceColor || DEFAULT_SERVICE_COLOR,
          staffId: values.staffId,
          staffName: staff?.name || appointment?.staffName || "",
          resourceId: values.resourceId || undefined,
          resourceName: resource?.name || undefined,
          startTime,
          endTime: finalEndTime,
          duration: currentTotalDuration || 60,
          status: appointment?.status || "PENDING",
          notes: values.notes || "",
          internalNotes: "",
          isRecurring: false,
          createdAt: appointment?.createdAt || new Date(),
          updatedAt: new Date(),
          createdBy: "",
        };

        onSubmit(newAppointment);
      });
    },
    [
      appointment,
      availableResources,
      availableServices,
      availableStaff,
      customerOptions,
      onSubmit,
    ]
  );

  return (
    <Form {...form}>
      <Stack
        gap={6}
        asChild
        id={id}
        className="form" // Dummy class to keep the id and other props if needed, but Stack asChild will pass them to the form
      >
        <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CustomerPicker
          placeholder={appointment?.customerName}
          customerOptions={customerOptions}
          isSearching={isSearching}
          onSearch={setCustomerSearch}
        />

        <FormField
          control={form.control}
          name="serviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Dịch vụ trị liệu</FormLabel>
              <FormControl>
                <MultiServiceSelector
                  selectedIds={field.value}
                  onChange={field.onChange}
                  availableServices={availableServices}
                />
              </FormControl>
              <FormDescription>
                Tổng thời lượng: {totalDuration} phút
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <StaffResourceSelect
          availableStaff={availableStaff}
          availableResources={availableResources}
        />

        <AppointmentDateTime
          timeWarning={timeWarning}
          conflicts={conflicts}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ghi chú cho lịch hẹn..."
                  className="min-h-20 resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Stack>
  </Form>
  );
}
