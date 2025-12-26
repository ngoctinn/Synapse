"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/alert";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui/hover-card";
import { Input } from "@/shared/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/ui/input-otp";
import { Label } from "@/shared/ui/label";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/shared/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Progress } from "@/shared/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/ui/resizable";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { showToast } from "@/shared/ui/sonner";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { ButtonGroup } from "@/shared/ui/button-group";
import { Item } from "@/shared/ui/item";
import { Kbd } from "@/shared/ui/kbd";
import { Spinner } from "@/shared/ui/spinner";
import { Toggle, toggleVariants } from "@/shared/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { ConfirmDialog } from "@/shared/ui/custom/confirm-dialog";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import { cn } from "@/shared/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  Clock,
  CreditCard,
  Moon,
  Settings,
  Smile,
  Sun,
  User,
  MoreVertical,
  Info,
  OctagonXIcon
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const showcaseSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Địa chỉ email không đúng định dạng"),
  service: z.string().min(1, "Vui lòng chọn một dịch vụ"),
  price: z.number().min(1000, "Giá tối thiểu là 1,000 VNĐ"),
  notes: z.string().optional(),
});

type ShowcaseFormValues = z.infer<typeof showcaseSchema>;

export default function DesignSystemPage() {
    const { setTheme, theme } = useTheme();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    const [time, setTimeValue] = useState<string>("09:00");

    const form = useForm<ShowcaseFormValues>({
      resolver: zodResolver(showcaseSchema),
      defaultValues: {
        fullName: "",
        email: "user@invalid",
        service: "",
        price: 0,
        notes: "",
      },
    });

    function onSubmit(data: ShowcaseFormValues) {
      showToast.success("Form submitted", JSON.stringify(data, null, 2));
    }

    return (
      <div className="container mx-auto py-10 space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between sticky top-0 z-50 bg-background py-6 border-b -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Design System</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Hệ thống thành phần UI chuẩn Synapse - Premium Vietnamese Design.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Badge variant="emerald" className="hidden sm:flex">v2.1 Stable</Badge>
          </div>
        </div>

        <div className="grid gap-10">
          {/* ======================= FUNDAMENTALS ======================= */}
          <Card className="shadow-premium-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">1. Buttons & Controls</CardTitle>
                <Badge variant="outline" className="font-normal">Cơ bản</Badge>
              </div>
              <CardDescription>Các thành phần tương tác chính, hỗ trợ đa dạng variant và trạng thái.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Variants</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="soft">Soft Tint</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Sizes & States</h3>
                  <div className="flex flex-wrap gap-4 items-end">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" className="rounded-full"><Settings className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center pt-2">
                    <Button isLoading>Loading State</Button>
                    <Button disabled variant="outline">Disabled State</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Selection Controls</h3>
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch id="airplane-mode" />
                      <Label htmlFor="airplane-mode" className="text-sm">Airplane Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">Accept terms</Label>
                    </div>
                    <RadioGroup defaultValue="option-one" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="r1" />
                        <Label htmlFor="r1" className="text-sm">Option A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="r2" />
                        <Label htmlFor="r2" className="text-sm">Option B</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="pt-4">
                    <Slider defaultValue={[75]} max={100} step={1} className="w-full max-w-[300px]" />
                    <p className="text-[10px] text-muted-foreground mt-2">Slider with premium smooth tracking.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ======================= INPUTS & FORMS ======================= */}
          <Card className="shadow-premium-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">2. Inputs & Forms (Premium Logic)</CardTitle>
                <Badge variant="emerald" className="font-normal">Real Form</Badge>
              </div>
              <CardDescription>Trình diễn cách sử dụng FormField, Validation thực tế với bo góc rounded-lg.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Ngô Tấn Tín" {...field} />
                          </FormControl>
                          <FormDescription>Tên đầy đủ hiển thị trên hồ sơ khách hàng.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Địa chỉ Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@gmail.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Dịch vụ chuyên biệt</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14">
                                <SelectValue placeholder="Chọn gói dịch vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="massage">Massage Body Premium</SelectItem>
                              <SelectItem value="facial">Skincare Pro-Max</SelectItem>
                              <SelectItem value="nail">Artistic Nails</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Giá liệu trình</FormLabel>
                          <FormControl>
                            <NumberInput
                              placeholder="100,000"
                              suffix="VNĐ"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">OTP Verification</Label>
                      <InputOTP maxLength={6}>
                        <InputOTPGroup>
                          {[0, 1, 2].map(i => <InputOTPSlot key={i} index={i} className="h-14 w-12" />)}
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          {[3, 4, 5].map(i => <InputOTPSlot key={i} index={i} className="h-14 w-12" />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <p className="text-[10px] text-muted-foreground">Ví dụ linh kiện InputOTP tích hợp.</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Lịch dự kiến (Single & Range)</Label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="group w-full h-14 justify-start text-left font-normal border-input hover:bg-accent/50 transition-all focus-premium data-[state=open]:border-primary/80 data-[state=open]:ring-[1.5px] data-[state=open]:ring-primary/20"
                            >
                              <CalendarDays className="mr-2 size-4 text-muted-foreground/60 transition-colors group-data-[state=open]:text-primary" />
                              <span className={cn("text-sm transition-colors", !date && "text-muted-foreground/60", date && "text-foreground")}>
                                {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày hẹn"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-premium-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="group w-full h-14 justify-start text-left font-normal border-input hover:bg-accent/50 transition-all focus-premium data-[state=open]:border-primary/80 data-[state=open]:ring-[1.5px] data-[state=open]:ring-primary/20"
                            >
                              <CalendarDays className="mr-2 size-4 text-muted-foreground/60 transition-colors group-data-[state=open]:text-primary" />
                              <span className={cn("text-sm transition-colors", !range?.from && "text-muted-foreground/60", range?.from && "text-foreground")}>
                                {range?.from ? (
                                  range.to ? (
                                    <>
                                      {format(range.from, "dd/MM")} - {format(range.to, "dd/MM")}
                                    </>
                                  ) : (
                                    format(range.from, "dd/MM/yyyy")
                                  )
                                ) : (
                                  "Chọn khoảng thời gian"
                                )}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-premium-lg" align="start">
                            <Calendar
                              mode="range"
                              selected={range}
                              onSelect={(val) => setRange(val as any)}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                       <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Chọn giờ (Time Picker - 24h Premium)</Label>
                       <div className="space-y-3">
                         <div className="space-y-1.5">
                            <Label className="text-[11px] text-muted-foreground">Giờ hẹn chuẩn</Label>
                            <TimePicker value={time} onChange={setTimeValue} />
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[11px] text-muted-foreground">Vô hiệu hóa (Disabled)</Label>
                            <TimePicker disabled value="09:00" />
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[11px] text-muted-foreground">Cảnh báo lỗi (Error)</Label>
                            <TimePicker hasError value="00:00" />
                         </div>
                       </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Ghi chú chi tiết</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Trình bày chi tiết tình trạng da hoặc yêu cầu đặc biệt..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Button type="submit" size="lg" className="px-10">Lưu thông tin</Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => form.trigger()}
                    >
                      Kiểm tra Validation
                    </Button>
                    <p className="text-xs text-muted-foreground ml-auto max-w-[200px] text-right">
                      Nhấn 'Kiểm tra Validation' để xem demo các thông báo lỗi chuẩn xác.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* ======================= FEEDBACK ======================= */}
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="shadow-premium-md">
              <CardHeader>
                <CardTitle className="text-xl">3. Notifications & States</CardTitle>
                <CardDescription>Hệ thống thông báo và trạng thái phản hồi người dùng.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={() => showToast.success("Đã lưu thành công", "Hồ sơ khách hàng đã được cập nhật.")}>Success Toast</Button>
                  <Button variant="outline" size="sm" onClick={() => showToast.error("Lỗi hệ thống", "Không thể kết nối đến máy chủ.")}>Error Toast</Button>
                </div>

                <div className="space-y-3">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Info className="size-4 text-primary" />
                    <AlertTitle>Thông tin</AlertTitle>
                    <AlertDescription className="text-xs opacity-80">Lịch hẹn của khách hàng sẽ được nhắc nhở tự động qua SMS.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive" className="bg-destructive/5">
                    <OctagonXIcon className="size-4" />
                    <AlertTitle>Cảnh báo</AlertTitle>
                    <AlertDescription className="text-xs opacity-80">Nhân viên này đang trong thời gian nghỉ phép.</AlertDescription>
                  </Alert>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Spinner className="size-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Sun-burst Loader</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[60%]" />
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Premium Soft Chips (Badge)</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Mặc định</Badge>
                    <Badge variant="success">Hoàn thành</Badge>
                    <Badge variant="destructive">Đã hủy</Badge>
                    <Badge variant="warning">Chờ xử lý</Badge>
                    <Badge variant="info">Đang đến</Badge>
                    <Badge variant="orange">Mới</Badge>
                    <Badge variant="violet">Khách VIP</Badge>
                    <Badge variant="emerald">Emerald</Badge>
                    <Badge variant="indigo">Indigo</Badge>
                    <Badge variant="amber">Amber</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="glass" className="bg-slate-900/80">Glass Style</Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
                          <Info className="size-3" /> Hover for info
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-none shadow-premium-md bg-card/95 backdrop-blur-md">
                        <p className="text-[10px]">Gợi ý thông tin bổ sung cho người dùng.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium-md">
              <CardHeader>
                <CardTitle className="text-xl">4. Navigation & Layout</CardTitle>
                <CardDescription>Các thành phần điều hướng nội dung.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Premium Soft Tabs (Bordered)</h4>
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList variant="soft" fullWidth className="h-11">
                      <TabsTrigger variant="soft" value="active" stretch>Hoạt động</TabsTrigger>
                      <TabsTrigger variant="soft" value="pending" stretch>Chờ duyệt</TabsTrigger>
                      <TabsTrigger variant="soft" value="history" stretch>Lịch sử</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Accordion</h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b-0 bg-muted/30 rounded-lg px-4 mb-2">
                      <AccordionTrigger className="hover:no-underline py-3">Quy trình đặt lịch?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs pb-4">
                        Khách hàng chọn dịch vụ, kỹ thuật viên và thời gian mong muốn.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b-0 bg-muted/30 rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline py-3">Chính sách hoàn tiền?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs pb-4">
                        Áp dụng cho các liệu trình chưa sử dụng trong vòng 7 ngày.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ======================= OVERLAYS ======================= */}
          <Card className="shadow-premium-md">
            <CardHeader>
              <CardTitle className="text-xl">5. Overlays & Dialogs</CardTitle>
              <CardDescription>Các thành phần lớp phủ tương tác như Popup, Modal, Sidebar.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5">Mở Dialog Modal</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] border-none shadow-premium-lg">
                    <DialogHeader>
                      <DialogTitle>Xác nhận lịch hẹn</DialogTitle>
                      <DialogDescription>Kiểm tra kỹ thông tin khách hàng và dịch vụ trước khi xác nhận.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                       <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                          <Avatar className="size-10 border-2 border-background">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>NT</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">Ngô Tấn Tín</p>
                            <p className="text-[10px] text-muted-foreground">Khách hàng thành viên</p>
                          </div>
                       </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full sm:w-auto">Xác nhận đặt lịch</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5">Mở Side Sheet</Button>
                  </SheetTrigger>
                  <SheetContent className="border-none shadow-premium-lg">
                    <SheetHeader className="pb-6">
                      <SheetTitle>Chi tiết liệu trình</SheetTitle>
                      <SheetDescription>Thông tin chi tiết về các buổi điều trị của khách hàng.</SheetDescription>
                    </SheetHeader>
                    <Separator className="mb-6 opacity-50" />
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tiến độ</Label>
                           <Progress value={75} className="h-2" />
                        </div>
                        <div className="grid gap-2 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-4">
                           "Khách hàng phản hồi rất tốt sau buổi điều trị đầu tiên."
                        </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="opacity-90 hover:opacity-100">Xác nhận nguy hiểm</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-none shadow-premium-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hành động không thể hoàn tác?</AlertDialogTitle>
                      <AlertDialogDescription>Dữ liệu khách hàng sẽ bị xóa vĩnh viễn khỏi hệ thống quản lý Spa.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                      <AlertDialogAction variant="destructive">Đồng ý xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>



                <div className="flex flex-wrap gap-4 w-full pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Demo state logic would go here, manually triggering for check
                      showToast.info("Mở Confirm Dialog...");
                    }}
                  >
                    Xem ConfirmDialog (Logic mượn)
                  </Button>
                  <p className="text-xs text-muted-foreground w-full">
                    * ConfirmDialog đã được chuẩn hóa để dùng chung các variant thành phần Button gốc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* ======================= MISCELLANEOUS ======================= */}
          <Card className="shadow-premium-md">
            <CardHeader>
              <CardTitle className="text-xl">6. Miscellaneous</CardTitle>
              <CardDescription>Các thành phần tiện ích và hiển thị bổ trợ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Collapsible</h4>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="size-4" /> Toggle Settings
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs text-muted-foreground">Cấu hình nâng cao cho các tham số hệ thống.</p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Hover Card</h4>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-primary">@synapse_dev</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 border-none shadow-premium-lg">
                      <div className="flex justify-between space-x-4">
                        <Avatar className="ring-[1.5px] ring-primary/10">
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>SY</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Synapse Ecosystem</h4>
                          <p className="text-xs text-muted-foreground">
                            Nền tảng quản lý Spa thông minh nhất Việt Nam.
                          </p>
                          <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-3 w-3 opacity-70" />{" "}
                            <span className="text-[10px] text-muted-foreground">
                              Hoạt động từ 2024
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Aspect Ratio 16:9</h4>
                  <div className="overflow-hidden rounded-xl border-4 border-background shadow-premium-sm">
                    <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                         <User className="size-10" />
                         <span className="text-[10px] font-bold">PREVIEW IMAGE</span>
                      </div>
                    </AspectRatio>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Normal Card Variant</h4>
                  <Card className="border-border/50 shadow-premium-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Standard Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs opacity-70">Thành phần này sử dụng phong cách Card tiêu chuẩn.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}
