"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

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

import { checkConflicts, searchCustomers } from "@/features/appointments/actions";
import { MockService } from "@/features/appointments/mock-data";
import { quickAppointmentFormSchema, type QuickAppointmentFormValues } from "@/features/appointments/schemas";
import type { Appointment, ConflictInfo, TimelineResource } from "@/features/appointments/types";

// Types
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

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

export function AppointmentForm({
  id = "appointment-form",
  appointment,
  defaultValues,
  onSubmit,
  availableStaff,
  availableResources,
  availableServices,
}: AppointmentFormProps) {
  // State
  const [isPending, startTransition] = useTransition();
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);

  // Form Initialization
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

  // Watched Values
  const watchedDate = useWatch({ control: form.control, name: "date" });
  const watchedStartTime = useWatch({ control: form.control, name: "startTime" });
  const watchedStaffId = useWatch({ control: form.control, name: "staffId" });
  const watchedServiceIds = useWatch({ control: form.control, name: "serviceIds" });

  // Buffer time là thời gian nghỉ dành cho KHÁCH SAU (dọn dẹp, chuẩn bị)
  // Không tính vào duration của booking hiện tại
  // Nếu khách làm nhiều dịch vụ liên tiếp → có thể bỏ qua buffer giữa các dịch vụ
  const totalDuration = useMemo(() => {
    return (watchedServiceIds || []).reduce((acc, serviceId) => {
      const service = availableServices.find((s) => s.id === serviceId);
      return acc + (service?.duration || 0);
    }, 0);
  }, [watchedServiceIds, availableServices]);

  // Effects
  useEffect(() => {
    const debouncedCheck = setTimeout(async () => {
      if (!watchedStaffId || !watchedStartTime || !watchedDate || !watchedServiceIds?.length) {
        setConflicts([]);
        setTimeWarning(null);
        return;
      }

      const [hours] = watchedStartTime.split(":").map(Number);
      if (hours < 8 || hours >= 21) {
        setTimeWarning("Ngoài giờ làm việc (08:00 - 21:00)");
      } else {
        setTimeWarning(null);
      }

      const [h, m] = watchedStartTime.split(":").map(Number);
      const start = new Date(watchedDate);
      start.setHours(h, m, 0, 0);

      const end = new Date(start.getTime() + (totalDuration || 60) * 60000);

      const res = await checkConflicts(watchedStaffId, start, end, appointment?.id);
      setConflicts((res.status === "success" && res.data) ? res.data : []);
    }, 500);

    return () => clearTimeout(debouncedCheck);
  }, [watchedDate, watchedStartTime, watchedStaffId, watchedServiceIds, appointment?.id, totalDuration]);

  // Customer Search Effect
  useEffect(() => {
    if (customerSearch.length < 2) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchCustomers(customerSearch);
      if (result.data) setCustomerOptions(result.data);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch]);

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
                  emptyMessage={customerSearch.length < 2 ? "Nhập 2 ký tự để tìm..." : "Không tìm thấy khách hàng"}
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
                <Textarea placeholder="Ghi chú cho lịch hẹn..." className="resize-none min-h-[80px]" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
