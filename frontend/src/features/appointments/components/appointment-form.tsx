"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    Briefcase,
    Calendar,
    Check,
    Clock,
    FileText,
    Phone,
    User
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { Appointment } from "@/features/appointments/types";
import { MOCK_SERVICES } from "@/features/services/data/mocks";
import { DialogFooter } from "@/shared/ui/dialog";
import { MOCK_RESOURCES } from "../mock-data";

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
    defaultDate?: Date;
    defaultResourceId?: string;
    onSuccess: (appointment: Partial<Appointment>) => void;
    onCancel: () => void;
}

export function AppointmentForm({
    defaultDate,
    defaultResourceId,
    onSuccess,
    onCancel
}: AppointmentFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            phoneNumber: "",
            serviceId: "",
            resourceId: defaultResourceId || "",
            date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            startTime: defaultDate ? format(defaultDate, 'HH:mm') : "09:00",
            notes: "",
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // Construct simplified appointment object
        const service = MOCK_SERVICES.find(s => s.id === values.serviceId);

        // Create Date objects
        const [year, month, day] = values.date.split('-').map(Number);
        const [hours, minutes] = values.startTime.split(':').map(Number);

        const startTime = new Date(year, month - 1, day, hours, minutes);
        const endTime = new Date(startTime.getTime() + (service?.duration || 60) * 60000);

        const newAppointment: Partial<Appointment> = {
            id: `apt-${Date.now()}`,
            customerId: `cust-${Date.now()}`, // Mock customer ID
            customerName: values.customerName,
            serviceId: values.serviceId,
            serviceName: service?.name || "Dịch vụ",
            resourceId: values.resourceId,
            startTime: startTime,
            endTime: endTime,
            status: 'pending',
            notes: values.notes,
            color: '#F59E0B', // Default pending color
        };

        console.log("Submitting Appointment:", newAppointment);
        onSuccess(newAppointment);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên khách hàng</FormLabel>
                                <FormControl>
                                    <InputWithIcon
                                        icon={User}
                                        placeholder="Nhập tên khách hàng..."
                                        {...field}
                                        className="h-11 rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <InputWithIcon
                                        icon={Phone}
                                        placeholder="0912..."
                                        {...field}
                                        className="h-11 rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày hẹn</FormLabel>
                                <FormControl>
                                    <InputWithIcon
                                        type="date"
                                        icon={Calendar}
                                        {...field}
                                        className="h-11 rounded-lg"
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
                                <FormLabel>Giờ bắt đầu</FormLabel>
                                <FormControl>
                                    <InputWithIcon
                                        type="time"
                                        icon={Clock}
                                        {...field}
                                        className="h-11 rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dịch vụ</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Chọn dịch vụ" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {MOCK_SERVICES.map(service => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name} ({service.duration}p)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nhân viên</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Chọn KTV" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {MOCK_RESOURCES.map(res => (
                                            <SelectItem key={res.id} value={res.id}>
                                                {res.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Textarea
                                        placeholder="Ghi chú thêm..."
                                        className="resize-none pl-10 min-h-[100px] rounded-lg"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="h-11">
                        Hủy
                    </Button>
                    <Button type="submit" className="h-11 min-w-[140px]">
                        <Check className="w-4 h-4 mr-2" />
                        Tạo lịch hẹn
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
