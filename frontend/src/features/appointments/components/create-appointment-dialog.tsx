"use client";

import { Appointment } from "@/features/appointments/types";
import { MOCK_SERVICES } from "@/features/services/data/mocks";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

interface CreateAppointmentDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultDate?: Date;
    defaultResourceId?: string;
    onSubmit?: (data: any) => void;
}

export function CreateAppointmentDialog({
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    defaultDate,
    defaultResourceId,
    onSubmit
}: CreateAppointmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

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

  // Reset form when defaults change or dialog opens
  useEffect(() => {
    if (isOpen) {
        form.reset({
            customerName: "",
            phoneNumber: "",
            serviceId: "",
            resourceId: defaultResourceId || "",
            date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            startTime: defaultDate ? format(defaultDate, 'HH:mm') : "09:00",
            notes: "",
        });
    }
  }, [isOpen, defaultDate, defaultResourceId, form]);

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

    if (onSubmit) {
        onSubmit(newAppointment);
    }

    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Only show trigger if not controlled externally (implied by usage, but here we keep it safe) */}
        {!controlledOpen && (
            <Button>
            <Plus className="mr-2 h-4 w-4" /> Tạo lịch hẹn
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo lịch hẹn mới cho khách hàng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên khách hàng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên khách hàng..." {...field} />
                            </FormControl>
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
                                <FormLabel>Ngày hẹn</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
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
                                    <Input type="time" {...field} />
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn dịch vụ" />
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn KTV" />
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
                                <Textarea placeholder="Ghi chú thêm..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button type="submit">Tạo lịch hẹn</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
