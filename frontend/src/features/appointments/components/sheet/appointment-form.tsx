"use client";

/**
 * AppointmentForm - Form tạo/sửa lịch hẹn
 *
 * - Combobox Khách hàng (searchable)
 * - Select Dịch vụ
 * - Select KTV
 * - Select Phòng/Giường
 * - DatePicker + TimePicker
 * - Zod validation
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from "@/shared/ui";
import { Combobox } from "@/shared/ui/custom/combobox";
import { DatePicker } from "@/shared/ui/custom/date-picker";

import {
  searchCustomers,
} from "../../actions";
import { MockService } from "../../mock-data";
import {
  quickAppointmentFormSchema,
  type QuickAppointmentFormValues,
} from "../../schemas";
import type { Appointment, TimelineResource } from "../../types";

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
  // onCancel is no longer needed in the form itself if buttons are external
  availableStaff: TimelineResource[];
  availableResources: TimelineResource[];
  availableServices: MockService[];
}

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

// ============================================
// TIME SLOTS
// ============================================

const TIME_SLOTS = generateTimeSlots();

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      );
    }
  }
  return slots;
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
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form setup
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

  // Search customers
  // Search customers with debounce
  // Using simplified logic with Combobox
  const handleCustomerSearch = (term: string) => {
      setCustomerSearch(term);
  }

  // Fetch customers effect (debounced)
   useEffect(() => {
    if (customerSearch.length < 2) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchCustomers(customerSearch);
      if (result.data) {
        setCustomerOptions(result.data);
      }
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  // Calculate end time based on services
  const selectedServices = useWatch({ control: form.control, name: "serviceIds" });
  const totalDuration = selectedServices.reduce(
    (acc: number, serviceId: string) => {
      const service = availableServices.find((s) => s.id === serviceId);
      return acc + (service?.duration || 0);
    },
    0
  );

  // Handle form submission
  const handleSubmit = (values: QuickAppointmentFormValues) => {
    startTransition(async () => {
      // Parse start time
      const [hours, minutes] = values.startTime.split(":").map(Number);
      const startTime = new Date(values.date);
      startTime.setHours(hours, minutes, 0, 0);

      // Calculate end time
      const endTime = new Date(
        startTime.getTime() + (totalDuration || 60) * 60 * 1000
      );

      // Get related data for display
      const customer = customerOptions.find((c) => c.id === values.customerId);
      const staff = availableStaff.find((s) => s.id === values.staffId);
      const service = availableServices.find(
        (s) => s.id === values.serviceIds[0]
      );
      const resource = values.resourceId
        ? availableResources.find((r) => r.id === values.resourceId)
        : undefined;

      // Create appointment object
      const newAppointment: Appointment = {
        id: appointment?.id || `apt-new-${Date.now()}`,
        customerId: values.customerId,
        customerName: customer?.name || appointment?.customerName || "",
        customerPhone: customer?.phone || appointment?.customerPhone || "",
        serviceId: values.serviceIds[0] || "",
        serviceName: service?.name || appointment?.serviceName || "",
        serviceColor: service ? "#8b5cf6" : appointment?.serviceColor || "#8b5cf6",
        staffId: values.staffId,
        staffName: staff?.name || appointment?.staffName || "",
        resourceId: values.resourceId || undefined,
        resourceName: resource?.name || undefined,
        startTime,
        endTime,
        duration: totalDuration || 60,
        status: appointment?.status || "pending",
        notes: values.notes || "",
        internalNotes: "",
        isRecurring: false,
        createdAt: appointment?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: "",
      };

      onSubmit(newAppointment);
    });
  };

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* CUSTOMER FIELD */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khách hàng <span className="text-destructive">*</span></FormLabel>
                   <FormControl>
                      <Combobox
                        options={customerOptions.map(c => ({
                            value: c.id,
                            label: c.name,
                            description: c.phone
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        onSearch={handleCustomerSearch}
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

            {/* SERVICE FIELD */}
            <FormField
              control={form.control}
              name="serviceIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dịch vụ <span className="text-destructive">*</span></FormLabel>
                  <Select
                    value={field.value[0] || ""}
                    onValueChange={(value) => field.onChange([value])}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {service.duration} phút
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Thời lượng dự kiến: {totalDuration || 0} phút
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STAFF FIELD */}
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kỹ thuật viên <span className="text-destructive">*</span></FormLabel>
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
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: s.color || "#8b5cf6" }}
                            />
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

            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel>Giờ bắt đầu <span className="text-destructive">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* RESOURCE FIELD */}
            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng / Giường</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value || undefined)}
                  >
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

            {/* NOTES FIELD */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú cho lịch hẹn..."
                      className="resize-none min-h-[80px]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
      </form>
    </Form>
  );
}
