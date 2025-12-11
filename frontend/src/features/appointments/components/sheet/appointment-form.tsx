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
import { vi } from "date-fns/locale";
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    Loader2,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import {
    Button,
    Calendar,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from "@/shared/ui";

import {
    getResourceList,
    getServiceList,
    getStaffList,
    searchCustomers,
} from "../../actions";
import {
    quickAppointmentFormSchema,
    type QuickAppointmentFormValues,
} from "../../schemas";
import type { Appointment } from "../../types";

// ============================================
// TYPES
// ============================================

interface AppointmentFormProps {
  appointment?: Appointment | null;
  defaultValues?: {
    date?: Date;
    startTime?: string;
    staffId?: string;
  };
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
}

interface ReferenceData {
  staff: Array<{ id: string; name: string; color?: string }>;
  services: Array<{ id: string; name: string; duration: number; price: number }>;
  resources: Array<{ id: string; name: string; type: string }>;
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
  appointment,
  defaultValues,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    staff: [],
    services: [],
    resources: [],
  });
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form setup
  const form = useForm<QuickAppointmentFormValues>({
    resolver: zodResolver(quickAppointmentFormSchema),
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

  // Load reference data
  useEffect(() => {
    const loadData = async () => {
      const [staffResult, serviceResult, resourceResult] = await Promise.all([
        getStaffList(),
        getServiceList(),
        getResourceList(),
      ]);

      setReferenceData({
        staff: (staffResult.data || []).map((s) => ({
          id: s.id,
          name: s.name,
          color: s.color,
        })),
        services: serviceResult.data || [],
        resources: (resourceResult.data || []).map((r) => ({
          id: r.id,
          name: r.name,
          type: r.type,
        })),
      });
    };
    loadData();
  }, []);

  // Search customers
  useEffect(() => {
    if (customerSearch.length < 2) {
      setCustomerOptions([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchCustomers(customerSearch);
      if (result.data) {
        setCustomerOptions(result.data);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [customerSearch]);

  // Calculate end time based on services
  const selectedServices = form.watch("serviceIds");
  const totalDuration = selectedServices.reduce(
    (acc: number, serviceId: string) => {
      const service = referenceData.services.find((s) => s.id === serviceId);
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
      const staff = referenceData.staff.find((s) => s.id === values.staffId);
      const service = referenceData.services.find(
        (s) => s.id === values.serviceIds[0]
      );
      const resource = values.resourceId
        ? referenceData.resources.find((r) => r.id === values.resourceId)
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* CUSTOMER FIELD */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Khách hàng *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? customerOptions.find((c) => c.id === field.value)
                            ?.name ||
                          appointment?.customerName ||
                          "Đã chọn"
                        : "Tìm kiếm khách hàng..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Nhập tên hoặc SĐT..."
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      {isSearching ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Đang tìm kiếm...
                        </div>
                      ) : customerOptions.length === 0 ? (
                        <CommandEmpty>
                          {customerSearch.length < 2
                            ? "Nhập ít nhất 2 ký tự để tìm"
                            : "Không tìm thấy khách hàng"}
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {customerOptions.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.id}
                              onSelect={() => {
                                field.onChange(customer.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === customer.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {customer.phone}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <FormLabel>Dịch vụ *</FormLabel>
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
                  {referenceData.services.map((service) => (
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
              <FormLabel>Kỹ thuật viên *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kỹ thuật viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {referenceData.staff.map((s) => (
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

        {/* DATE & TIME FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date()}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ bắt đầu *</FormLabel>
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
                  {referenceData.resources.map((resource) => (
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
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {appointment ? "Lưu thay đổi" : "Tạo lịch hẹn"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
