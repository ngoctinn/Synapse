"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { areIntervalsOverlapping, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Clock,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"; // Import Alert components
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

import { Appointment, Customer, Resource } from "@/features/appointments/types";
import { Service } from "@/features/services/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/shared/ui/command";

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
    existingAppointments?: Appointment[]; // Add this prop
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
    const [openCombobox, setOpenCombobox] = useState(false);
    const [openServiceCombobox, setOpenServiceCombobox] = useState(false);
    const [openResourceCombobox, setOpenResourceCombobox] = useState(false);
    const [customerTab, setCustomerTab] = useState<"search" | "new">("search");
    const [searchQuery, setSearchQuery] = useState("");

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

    // Fix Hydration Mismatch: Set default date on client side
    useEffect(() => {
        if (!form.getValues("date")) {
            form.setValue("date", format(new Date(), 'yyyy-MM-dd'));
        }
    }, []);

    const selectedService = useMemo(() =>
        services.find(s => s.id === selectedServiceId),
    [selectedServiceId]);

    const estimatedEndTime = useMemo(() => {
        if (!selectedService || !startTimeStr) return null;
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        const endDate = new Date(date.getTime() + selectedService.duration * 60000);
        return format(endDate, 'HH:mm');
    }, [selectedService, startTimeStr]);

    // --- Conflict Detection Logic ---
    const conflictWarning = useMemo(() => {
        if (!selectedService || !startTimeStr || !form.watch("resourceId") || !form.watch("date")) return null;

        const dateObj = new Date(form.watch("date"));
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const startTime = new Date(dateObj);
        startTime.setHours(hours, minutes);
        const duration = selectedService.duration;
        const buffer = selectedService.buffer_time || 0;
        const endTime = new Date(startTime.getTime() + (duration + buffer) * 60000);
        const resourceId = form.watch("resourceId");

        const hasConflict = existingAppointments.some(apt => {
            // 1. First Pass: Filter by Day (Fastest Check)
            if (!isSameDay(startTime, apt.startTime)) return false;

            // 2. Skip current appointment if updating
            if (initialData && apt.id === initialData.id) return false;

            // 3. Skip different resources
            if (apt.resourceId !== resourceId) return false;

            // 4. Skip cancelled
            if (apt.status === 'cancelled') return false;

            // 5. Expensive Interval Check
            return areIntervalsOverlapping(
                { start: startTime, end: endTime },
                { start: apt.startTime, end: apt.endTime }
            );
        });

        if (hasConflict) {
            return "Nhân viên này đã có lịch hẹn trong khung giờ bạn chọn!";
        }
        return null;
    }, [selectedService, startTimeStr, form.watch("resourceId"), form.watch("date"), existingAppointments, initialData]);

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
        let customerId = initialData?.customerId; // Mặc định giữ ID cũ nếu có

        if (customerTab === 'new') {
            // Nếu Tab là 'new', XÓA customerId để báo hiệu Backend cần tạo mới
            customerId = undefined;
        } else {
             // Nếu Tab là 'search', tìm customerId tương ứng với tên/sđt (nếu User chọn từ list)
             // Lưu ý: Logic tìm kiếm hiện tại chỉ fill text vào form.
             // Cần cải tiến: Khi chọn từ Combo box, nên lưu hidden field 'customerId'.
             // Tạm thời: Logic này giả định User đã chọn đúng.
             // Trong thực tế: Cần lưu customerId vào state hoặc hidden form field.
             const matchedCustomer = customers.find(c => c.name === values.customerName && c.phone === values.phoneNumber);
             if (matchedCustomer) {
                 customerId = matchedCustomer.id;
             }
             // Nếu không match (user gõ tay vào ô search mà ko chọn), coi như khách mới hoặc lỗi?
             // Hiện tại xử lý an toàn: Nếu không tìm thấy ID, coi như khách mới (undefined)
             if (!customerId && !initialData) {
                 customerId = undefined; // Sẽ kích hoạt tạo mới
             }
        }

        const newAppointment: Partial<Appointment> & { isNewCustomer?: boolean } = {
            id: initialData?.id || `apt-${crypto.randomUUID()}`,
            customerId: customerId || "", // Empty string if undefined to satisfy type, logic backend will check
            isNewCustomer: !customerId, // Flag explicitly
            customerName: values.customerName,
            customerPhone: values.phoneNumber, // Add phone number to transfer object
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

                {/* 1. Customer Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2">
                        <h3 className="text-sm font-semibold text-foreground">Khách hàng</h3>
                    </div>

                    <Tabs value={customerTab} onValueChange={(v) => setCustomerTab(v as "search" | "new")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
                            <TabsTrigger value="search" className="text-xs">Tìm khách cũ</TabsTrigger>
                            <TabsTrigger value="new" className="text-xs">Khách mới</TabsTrigger>
                        </TabsList>

                        <TabsContent value="search" className="mt-0 animate-in fade-in slide-in-from-left-1 duration-200">
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
                                                        "w-full justify-between h-10 rounded-lg bg-background border-input transition-all font-normal shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                                                        {field.value
                                                            ? <span className="text-foreground">{field.value} {form.watch("phoneNumber") && <span className="text-muted-foreground">({form.watch("phoneNumber")})</span>}</span>
                                                            : "Tìm kiếm (Tên/SĐT)..."}
                                                    </div>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[340px] p-0" align="start">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Nhập từ khóa..."
                                                        value={searchQuery}
                                                        onValueChange={setSearchQuery}
                                                    />
                                                    <CommandList className="max-h-[300px] overflow-y-auto">
                                                        <CommandEmpty className="py-4 text-center text-sm">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <p className="text-muted-foreground">Không tìm thấy.</p>
                                                                {searchQuery && (
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setCustomerTab("new");
                                                                            form.setValue("phoneNumber", searchQuery);
                                                                            form.setValue("customerName", "");
                                                                            setOpenCombobox(false);
                                                                        }}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        Tạo mới "{searchQuery}"
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup heading="Đã lưu">
                                                            {customers.map((customer) => (
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="new" className="mt-0 animate-in fade-in slide-in-from-right-1 duration-200">
                             <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/80 font-normal">Họ tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên..." {...field} className="bg-background h-10 shadow-sm hover:shadow-md focus-premium" />
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
                                            <FormLabel className="text-foreground/80 font-normal">SĐT</FormLabel>
                                            <FormControl>
                                                <Input placeholder="09..." {...field} className="bg-background h-10 shadow-sm hover:shadow-md focus-premium" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 2. Date & Time Section */}
                <div className="space-y-4">
                     <div className="flex items-center gap-2 pb-2">
                        <h3 className="text-sm font-semibold text-foreground">Thời gian</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-foreground/80 font-normal">Ngày hẹn</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-10 w-full pl-3 text-left font-normal rounded-lg border-input bg-background transition-all shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                                    {field.value ? (
                                                        format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
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
                                                onSelect={(date: Date | undefined) => field.onChange(date ? format(date, 'yyyy-MM-dd') : "")}
                                                disabled={(date: Date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
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
                                    <FormLabel className="text-foreground/80 font-normal">Giờ bắt đầu</FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="h-10 rounded-lg shadow-sm hover:shadow-md hover:border-input transition-all font-normal focus-premium"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {conflictWarning && (
                        <Alert variant="destructive" className="mt-2 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Trùng lịch!</AlertTitle>
                            <AlertDescription>
                                {conflictWarning}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2">
                        <h3 className="text-sm font-semibold text-foreground">Dịch vụ & Nhân viên</h3>
                    </div>

                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-foreground/80 font-normal">Dịch vụ</FormLabel>
                                    <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openServiceCombobox}
                                                    className={cn(
                                                        "w-full justify-between h-auto min-h-[40px] py-2 rounded-lg bg-background px-3 font-normal transition-all text-left shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? (() => {
                                                            const service = services.find(s => s.id === field.value);
                                                            return service ? (
                                                                <div className="flex items-start gap-3 w-full">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium truncate text-sm">{service.name}</div>
                                                                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                                            <Badge variant="secondary" className="text-[10px] px-1 h-5 rounded-sm font-normal text-muted-foreground">{service.duration} phút</Badge>
                                                                            <span>•</span>
                                                                            <span className="font-medium text-primary">
                                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : "Chọn dịch vụ";
                                                          })()
                                                        : <span className="flex items-center"><Search className="mr-2 h-4 w-4 opacity-50"/> Tìm dịch vụ...</span>}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Tìm tên dịch vụ..." />
                                                <CommandList className="max-h-[300px] overflow-y-auto">
                                                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                                    {Array.from(new Set(services.map(s => s.category))).map(category => (
                                                        <CommandGroup key={category || "Khác"} heading={category || "Khác"}>
                                                            {services.filter(s => s.category === category).map((service) => (
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
                                    <FormLabel className="text-foreground/80 font-normal">Nhân viên thực hiện</FormLabel>
                                    <Popover open={openResourceCombobox} onOpenChange={setOpenResourceCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openResourceCombobox}
                                                    className={cn(
                                                        "w-full justify-between h-10 rounded-lg bg-background px-3 font-normal transition-all shadow-sm hover:shadow-md hover:border-input focus-premium",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                        {field.value
                                                        ? (() => {
                                                            const resource = resources.find(r => r.id === field.value);
                                                            return resource ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage src={resource.avatar} alt={resource.name} />
                                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                                            {resource.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="font-medium text-sm">{resource.name}</span>
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
                                                <CommandList className="max-h-[300px] overflow-y-auto">
                                                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                                    <CommandGroup>
                                                        {resources.map((resource) => (
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
                                                                <Avatar className="h-7 w-7 border">
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
                </div>

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

                {estimatedEndTime && selectedService && (
                    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-primary mb-0.5">Thời gian dự kiến</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                {selectedService.name} ({selectedService.duration}p): <span className="font-medium text-foreground">{startTimeStr}</span> — <span className="font-medium text-foreground">{estimatedEndTime}</span>
                            </p>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
}
