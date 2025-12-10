"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";

import { Appointment, Customer, Resource } from "@/features/appointments/types";
import { Service } from "@/features/services/types";
import { useAppointmentConflict } from "../hooks/use-appointment-conflict";
import { CustomerSelectionField } from "./form-sections/customer-selection";
import { ServiceSelectionField } from "./form-sections/service-selection";
import { TimeSelectionField } from "./form-sections/time-selection";

const formSchema = z.object({
  customerName: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  phoneNumber: z.string().optional(),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  resourceId: z.string().min(1, "Vui lòng chọn nhân viên"),
  date: z.string(), // ISO Date string YYYY-MM-DD
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không hợp lệ"),
  notes: z.string().optional(),
});

interface AppointmentFormProps {
    id?: string;
    mode?: "create" | "update";
    defaultDate?: Date;
    defaultResourceId?: string;
    initialData?: Appointment | null;
    services: Service[];
    customers: Customer[];
    resources: Resource[];
    existingAppointments?: Appointment[];
    onSuccess: (appointment: Partial<Appointment>) => void;
    onCancel: () => void;
}

export function AppointmentForm({
    id,
    mode = "create",
    defaultDate,
    defaultResourceId,
    initialData,
    services,
    customers,
    resources,
    existingAppointments = [],
    onSuccess,
    onCancel,
}: AppointmentFormProps) {
    const [customerTab, setCustomerTab] = useState<"search" | "new">("search");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: initialData?.customerName || "",
            phoneNumber: initialData?.customerId ? (customers.find(c => c.id === initialData.customerId)?.phone || "") : "",
            serviceId: initialData?.serviceId || "",
            resourceId: initialData?.resourceId || defaultResourceId || "",
            date: initialData ? format(initialData.startTime, 'yyyy-MM-dd') : (defaultDate ? format(defaultDate, 'yyyy-MM-dd') : ""),
            startTime: initialData ? format(initialData.startTime, 'HH:mm') : (defaultDate ? format(defaultDate, 'HH:mm') : "09:00"),
            notes: initialData?.notes || "",
        },
    });

    const selectedServiceId = form.watch("serviceId");
    const startTimeStr = form.watch("startTime");
    const selectedDate = form.watch("date");
    const selectedResourceId = form.watch("resourceId");

    // Fix Hydration Mismatch
    useEffect(() => {
        if (!form.getValues("date")) {
            form.setValue("date", format(new Date(), 'yyyy-MM-dd'));
        }
    }, []);

    const selectedService = useMemo(() =>
        services.find(s => s.id === selectedServiceId),
    [selectedServiceId, services]);

    const estimatedEndTime = useMemo(() => {
        if (!selectedService || !startTimeStr) return null;
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        const endDate = new Date(date.getTime() + selectedService.duration * 60000);
        return format(endDate, 'HH:mm');
    }, [selectedService, startTimeStr]);

    // --- Conflict Detection Logic (Extracted Hook) ---
    const { conflictWarning } = useAppointmentConflict({
        date: selectedDate,
        startTimeStr: startTimeStr,
        duration: selectedService?.duration || 0,
        bufferTime: selectedService?.buffer_time || 0,
        resourceId: selectedResourceId,
        existingAppointments,
        currentAppointmentId: initialData?.id
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        if (conflictWarning) {
            form.setError("startTime", { message: "Vui lòng chọn giờ khác do trùng lịch." });
            return;
        }

        const service = services.find(s => s.id === values.serviceId);
        const dateObj = new Date(values.date);
        const [hours, minutes] = values.startTime.split(':').map(Number);

        const startTime = new Date(dateObj);
        startTime.setHours(hours, minutes);

        // Calculate End Time INCLUDING buffer time
        const duration = service?.duration || 60;
        const buffer = service?.buffer_time || 0;
        const endTime = new Date(startTime.getTime() + (duration + buffer) * 60000);

        // Logic xử lý Khách hàng
        let customerId = initialData?.customerId;

        if (customerTab === 'new') {
            customerId = undefined;
        } else {
             // Logic giả định User đã chọn đúng từ combobox match name/phone
             const matchedCustomer = customers.find(c => c.name === values.customerName && c.phone === values.phoneNumber);
             if (matchedCustomer) {
                 customerId = matchedCustomer.id;
             }
             if (!customerId && !initialData) {
                 customerId = undefined;
             }
        }

        const newAppointment: Partial<Appointment> & { isNewCustomer?: boolean } = {
            id: initialData?.id || `apt-${crypto.randomUUID()}`,
            customerId: customerId || "",
            isNewCustomer: !customerId,
            customerName: values.customerName,
            customerPhone: values.phoneNumber,
            serviceId: values.serviceId,
            serviceName: service?.name || "Dịch vụ",
            resourceId: values.resourceId,
            startTime: startTime,
            endTime: endTime,
            price: service?.price || 0,
            bufferTime: buffer,
            status: initialData?.status || 'pending',
            notes: values.notes,
            color: initialData?.color || '#3B82F6',
        };

        onSuccess(newAppointment);
    };

    return (
        <Form {...form}>
            <form id={id} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                <CustomerSelectionField
                    customers={customers}
                    customerTab={customerTab}
                    onTabChange={setCustomerTab}
                />

                <TimeSelectionField
                    estimatedEndTime={estimatedEndTime}
                    selectedServiceName={selectedService?.name}
                    selectedServiceDuration={selectedService?.duration}
                    startTimeStr={startTimeStr}
                    conflictWarning={conflictWarning}
                />

                <ServiceSelectionField
                    services={services}
                    resources={resources}
                />

                {/* Notes Section */}
                <div className="space-y-4">
                     <div className="flex items-center gap-2 pb-2">
                        <h3 className="text-sm font-semibold text-foreground">Ghi chú</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                                        className="resize-none min-h-[80px] rounded-lg border-input bg-background font-normal shadow-sm hover:shadow-md hover:border-input focus-premium"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}
