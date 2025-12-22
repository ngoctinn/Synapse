"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { useCallback, useTransition } from "react";
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
  RequiredMark,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from "@/shared/ui";
import { Combobox } from "@/shared/ui/custom/combobox";
import { DatePicker } from "@/shared/ui/custom/date-picker";
import { TimePicker } from "@/shared/ui/custom/time-picker";

import { MockService } from "@/features/appointments/mock-data";
import { quickAppointmentFormSchema, type QuickAppointmentFormValues } from "@/features/appointments/schemas";
import type { Appointment, TimelineResource } from "@/features/appointments/types";
import { useConflictCheck, useCustomerSearch } from "@/features/appointments/hooks";

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
      startTime: defaultValues?.startTime || (appointment ? format(appointment.startTime, "HH:mm") : "09:00"),
      notes: appointment?.notes || "",
    },
  });

  // Custom hooks - extracted logic
  const { customerOptions, isSearching, setCustomerSearch } = useCustomerSearch();
  const { conflicts, timeWarning, totalDuration } = useConflictCheck({
    form,
    availableServices,
    appointmentId: appointment?.id,
  });

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = useCallback((values: QuickAppointmentFormValues) => {
    startTransition(() => {
      const [hours, minutes] = values.startTime.split(":").map(Number);
      const startTime = new Date(values.date);
      startTime.setHours(hours, minutes, 0, 0);

      // Data lookup
      const customer = customerOptions.find((c) => c.id === values.customerId);
      const staff = availableStaff.find((s) => s.id === values.staffId);
      const service = availableServices.find((s) => s.id === values.serviceIds[0]);
      const resource = values.resourceId ? availableResources.find((r) => r.id === values.resourceId) : undefined;

      const bookingItems = values.serviceIds.map(sId => {
        const s = availableServices.find(as => as.id === sId);
        return {
          serviceId: sId,
          serviceName: s?.name || "",
          price: s?.price || 0,
          duration: s?.duration || 0,
          startTime,
          staffId: values.staffId,
          resourceId: values.resourceId || undefined
        };
      });

      const currentTotalDuration = bookingItems.reduce((acc, item) => acc + item.duration, 0);
      const currentTotalPrice = bookingItems.reduce((acc, item) => acc + item.price, 0);
      const finalEndTime = new Date(startTime.getTime() + (currentTotalDuration || 60) * 60000);

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
        serviceColor: service ? "#8b5cf6" : appointment?.serviceColor || "#8b5cf6",
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
  }, [appointment, availableResources, availableServices, availableStaff, customerOptions, onSubmit]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Customer */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách hàng <RequiredMark /></FormLabel>
              <FormControl>
                <Combobox
                  options={customerOptions.map(c => ({ value: c.id, label: c.name, description: c.phone }))}
                  value={field.value}
                  onChange={field.onChange}
                  onSearch={setCustomerSearch}
                  placeholder={appointment?.customerName || "Tìm khách hàng..."}
                  searchPlaceholder="Nhập tên hoặc SĐT..."
                  emptyMessage="Nhập 2 ký tự để tìm..."
                  isLoading={isSearching}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services */}
        <FormField
          control={form.control}
          name="serviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dịch vụ trị liệu <RequiredMark /></FormLabel>
              <FormControl>
                <MultiServiceSelector
                  selectedIds={field.value}
                  onChange={field.onChange}
                  availableServices={availableServices}
                />
              </FormControl>
              <FormDescription>Tổng thời lượng: {totalDuration} phút</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Staff */}
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kỹ thuật viên <RequiredMark /></FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kỹ thuật viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableStaff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || "#8b5cf6" }} />
                        {s.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày <RequiredMark /></FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chọn ngày"
                    minDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ bắt đầu <RequiredMark /></FormLabel>
                <FormControl>
                  <TimePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Warnings */}
          {(timeWarning || conflicts.length > 0) && (
            <div className="col-span-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm space-y-1">
              {timeWarning && (
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-500 font-medium">
                  <AlertTriangle className="w-4 h-4"/> {timeWarning}
                </div>
              )}
              {conflicts.map(c => (
                <div key={c.eventId} className="flex items-center gap-2 font-medium text-destructive">
                  <AlertTriangle className="w-4 h-4"/> {c.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <FormField
          control={form.control}
          name="resourceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng / Giường</FormLabel>
              <Select value={field.value || ""} onValueChange={(value) => field.onChange(value || undefined)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng (không bắt buộc)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableResources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Ghi chú cho lịch hẹn..." className="resize-none min-h-20" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
