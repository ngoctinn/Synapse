"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Briefcase,
    Calendar as CalendarIcon,
    Check,
    ChevronsUpDown,
    Clock,
    FileText,
    Phone,
    Plus,
    Search,
    Sparkles,
    User,
    X
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { Textarea } from "@/shared/ui/textarea";

import { Appointment } from "@/features/appointments/types";
import { MOCK_SERVICES } from "@/features/services/data/mocks";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/shared/ui/command";
import { DialogFooter } from "@/shared/ui/dialog";
import { useMemo, useState } from "react";
import { MOCK_RESOURCES } from "../mock-data";

const MOCK_CUSTOMERS = [
    { id: "c1", name: "Nguyễn Văn A", phone: "0912345678" },
    { id: "c2", name: "Trần Thị B", phone: "0987654321" },
    { id: "c3", name: "Lê Văn C", phone: "0909090909" },
    { id: "c4", name: "Phạm Thu Hương", phone: "0911223344" },
];

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
    onSuccess: (appointment: Partial<Appointment>) => void;
    onCancel: () => void;
    isSheet?: boolean;
}

export function AppointmentForm({
    id,
    mode = "create",
    defaultDate,
    defaultResourceId,
    initialData,
    onSuccess,
    onCancel,
    isSheet = false
}: AppointmentFormProps) {
    const [openCombobox, setOpenCombobox] = useState(false);
    const [openServiceCombobox, setOpenServiceCombobox] = useState(false);
    const [openResourceCombobox, setOpenResourceCombobox] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: initialData?.customerName || "",
            phoneNumber: initialData?.customerId ? (MOCK_CUSTOMERS.find(c => c.id === initialData.customerId)?.phone || "") : "",
            serviceId: initialData?.serviceId || "",
            resourceId: initialData?.resourceId || defaultResourceId || "",
            date: initialData ? format(initialData.startTime, 'yyyy-MM-dd') : (defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
            startTime: initialData ? format(initialData.startTime, 'HH:mm') : (defaultDate ? format(defaultDate, 'HH:mm') : "09:00"),
            notes: initialData?.notes || "",
        },
    });


    const selectedServiceId = form.watch("serviceId");
    const startTimeStr = form.watch("startTime");

    const selectedService = useMemo(() =>
        MOCK_SERVICES.find(s => s.id === selectedServiceId),
    [selectedServiceId]);

    const estimatedEndTime = useMemo(() => {
        if (!selectedService || !startTimeStr) return null;
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        const endDate = new Date(date.getTime() + selectedService.duration * 60000);
        return format(endDate, 'HH:mm');
    }, [selectedService, startTimeStr]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const service = MOCK_SERVICES.find(s => s.id === values.serviceId);


        const dateObj = new Date(values.date);
        const [hours, minutes] = values.startTime.split(':').map(Number);

        const startTime = new Date(dateObj);
        startTime.setHours(hours, minutes);

        const endTime = new Date(startTime.getTime() + (service?.duration || 60) * 60000);

        const newAppointment: Partial<Appointment> = {
            id: initialData?.id || `apt-${Date.now()}`,
            customerId: initialData?.customerId || `cust-${Date.now()}`,
            customerName: values.customerName,
            serviceId: values.serviceId,
            serviceName: service?.name || "Dịch vụ",
            resourceId: values.resourceId,
            startTime: startTime,
            endTime: endTime,
            status: initialData?.status || 'pending',
            notes: values.notes,
            color: initialData?.color || '#3B82F6',
        };

        onSuccess(newAppointment);
    };

    return (
        <Form {...form}>
            <form id={id} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">


                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <User className="w-4 h-4" />
                        <h3 className="text-sm uppercase tracking-wide">Thông tin khách hàng</h3>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4 shadow-sm">
                        {!isNewCustomer ? (
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCombobox}
                                                    className={cn(
                                                        "w-full justify-between h-11 rounded-lg bg-background border-input hover:bg-accent/50 hover:border-primary/50 transition-all duration-200",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                                                        {field.value
                                                            ? <span className="font-medium">{field.value} {form.watch("phoneNumber") && <span className="text-muted-foreground font-normal">({form.watch("phoneNumber")})</span>}</span>
                                                            : "Tìm kiếm khách hàng (Tên/SĐT)..."}
                                                    </div>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[340px] p-0" align="start">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Nhập tên hoặc số điện thoại..."
                                                        value={searchQuery}
                                                        onValueChange={setSearchQuery}
                                                    />
                                                    <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                                        <CommandEmpty className="py-6 text-center text-sm">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <p className="text-muted-foreground">Không tìm thấy khách hàng.</p>
                                                                {searchQuery && (
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setIsNewCustomer(true);
                                                                            form.setValue("phoneNumber", searchQuery);
                                                                            form.setValue("customerName", "");
                                                                            setOpenCombobox(false);
                                                                        }}
                                                                        className="w-full max-w-[200px]"
                                                                    >
                                                                        <Plus className="mr-2 h-3.5 w-3.5" />
                                                                        Thêm mới "{searchQuery}"
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup heading="Khách hàng đã lưu">
                                                            {MOCK_CUSTOMERS.map((customer) => (
                                                                <CommandItem
                                                                    key={customer.id}
                                                                    value={`${customer.name} ${customer.phone}`}
                                                                    onSelect={() => {
                                                                        form.setValue("customerName", customer.name);
                                                                        form.setValue("phoneNumber", customer.phone);
                                                                        setOpenCombobox(false);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4 text-primary",
                                                                            form.watch("phoneNumber") === customer.phone ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{customer.name}</span>
                                                                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <div className="flex justify-end">
                                             <Button
                                                variant="link"
                                                className="h-auto p-0 text-xs text-primary"
                                                onClick={() => setIsNewCustomer(true)}
                                                type="button"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Tạo khách hàng mới
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
                                        Khách hàng mới
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsNewCustomer(false)}
                                        className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Họ và tên</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon icon={User} placeholder="Nhập tên khách..." {...field} className="bg-background" autoFocus />
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
                                                <FormLabel className="text-xs">Số điện thoại</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon icon={Phone} placeholder="09..." {...field} className="bg-background" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />


                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Clock className="w-4 h-4" />
                        <h3 className="text-sm uppercase tracking-wide">Thời gian hẹn</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Ngày</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-11 w-full pl-3 text-left font-normal rounded-lg border-input hover:bg-accent hover:border-primary/50 transition-all",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP", { locale: vi })
                                                    ) : (
                                                        <span>Chọn ngày</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : "")}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                                className="pointer-events-auto"
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
                                    <FormLabel>Giờ bắt đầu</FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="h-11 rounded-lg hover:border-primary/50 transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />


                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Briefcase className="w-4 h-4" />
                        <h3 className="text-sm uppercase tracking-wide">Dịch vụ & Kỹ thuật viên</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Dịch vụ</FormLabel>
                                <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openServiceCombobox}
                                                className={cn(
                                                    "w-full justify-between h-auto min-h-[44px] py-2 rounded-lg bg-background px-3 font-normal hover:bg-accent hover:border-primary/50 transition-all text-left",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? (() => {
                                                        const service = MOCK_SERVICES.find(s => s.id === field.value);
                                                        return service ? (
                                                            <div className="flex items-start gap-3 w-full">
                                                                <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md shrink-0">
                                                                    <Sparkles className="w-4 h-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium truncate">{service.name}</div>
                                                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                                        <Badge variant="secondary" className="text-[10px] px-1 h-5">{service.duration} phút</Badge>
                                                                        <span>•</span>
                                                                        <span className="font-medium text-primary">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : "Chọn dịch vụ";
                                                      })()
                                                    : <span className="flex items-center"><Search className="mr-2 h-4 w-4 opacity-50"/> Chọn dịch vụ...</span>}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Tìm tên dịch vụ..." />
                                            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                                <CommandEmpty>Không tìm thấy dịch vụ.</CommandEmpty>
                                                {Array.from(new Set(MOCK_SERVICES.map(s => s.category))).map(category => (
                                                    <CommandGroup key={category} heading={category}>
                                                        {MOCK_SERVICES.filter(s => s.category === category).map((service) => (
                                                            <CommandItem
                                                                key={service.id}
                                                                value={service.name}
                                                                onSelect={() => {
                                                                    form.setValue("serviceId", service.id);
                                                                    setOpenServiceCombobox(false);
                                                                }}
                                                                className="flex items-start gap-2 py-3 px-3 cursor-pointer aria-selected:bg-accent/50"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mt-1 h-4 w-4 text-primary shrink-0",
                                                                        field.value === service.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium text-sm">{service.name}</span>
                                                                        <span className="text-xs font-semibold text-primary">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                                        <span className="line-clamp-1">{service.description}</span>
                                                                        <div className="flex items-center shrink-0 ml-2">
                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                            {service.duration}p
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Nhân viên thực hiện</FormLabel>
                                <Popover open={openResourceCombobox} onOpenChange={setOpenResourceCombobox}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openResourceCombobox}
                                                className={cn(
                                                    "w-full justify-between h-11 rounded-lg bg-background px-3 font-normal hover:bg-accent hover:border-primary/50 transition-all",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                    {field.value
                                                    ? (() => {
                                                        const resource = MOCK_RESOURCES.find(r => r.id === field.value);
                                                        return resource ? (
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={resource.avatar} alt={resource.name} />
                                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                                        {resource.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium">{resource.name}</span>
                                                                <span className="text-xs text-muted-foreground">• {resource.role}</span>
                                                            </div>
                                                        ) : "Chọn nhân viên";
                                                        })()
                                                    : <span className="flex items-center"><Search className="mr-2 h-4 w-4 opacity-50"/> Chọn nhân viên...</span>}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Tìm nhân viên..." />
                                            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                                <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
                                                <CommandGroup>
                                                    {MOCK_RESOURCES.map((resource) => (
                                                        <CommandItem
                                                            key={resource.id}
                                                            value={resource.name}
                                                            onSelect={() => {
                                                                form.setValue("resourceId", resource.id);
                                                                setOpenResourceCombobox(false);
                                                            }}
                                                            className="flex items-center gap-2 py-2 cursor-pointer"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4 text-primary",
                                                                    field.value === resource.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <Avatar className="h-8 w-8 border">
                                                                <AvatarImage src={resource.avatar} alt={resource.name} />
                                                                <AvatarFallback className="text-xs bg-muted">
                                                                    {resource.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{resource.name}</span>
                                                                <span className="text-xs text-muted-foreground">{resource.role}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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
                                <div className="relative group">
                                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <Textarea
                                        placeholder="Nhập ghi chú cho cuộc hẹn..."
                                        className="resize-none pl-10 min-h-[80px] rounded-lg border-input group-hover:border-primary/50 transition-all font-normal"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {estimatedEndTime && selectedService && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-primary">Tóm tắt lịch hẹn</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Khách sẽ làm <span className="font-medium text-foreground">{selectedService.name}</span> từ <span className="font-medium text-foreground">{startTimeStr}</span> đến dự kiến <span className="font-medium text-foreground">{estimatedEndTime}</span>.
                            </p>
                        </div>
                    </div>
                )}

                {!isSheet && (
                    <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur z-10 pb-2">
                        <Button type="button" variant="ghost" onClick={onCancel} className="h-11 hover:bg-muted">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="h-11 min-w-[140px] shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
                            <Check className="w-4 h-4 mr-2" />
                            {mode === "create" ? "Xác nhận đặt lịch" : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                )}
            </form>
        </Form>
    );
}
