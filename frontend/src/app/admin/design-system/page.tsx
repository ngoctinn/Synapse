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

import { NumberInput } from "@/shared/ui/custom/number-input";
import { showToast } from "@/shared/ui/sonner";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { ButtonGroup } from "@/shared/ui/button-group";
import { Item } from "@/shared/ui/item";
import { Kbd } from "@/shared/ui/kbd";
import { Spinner } from "@/shared/ui/spinner";
import { Toggle, toggleVariants } from "@/shared/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  CreditCard,
  Moon,
  Settings,
  Smile,
  Sun,
  User,
  MoreVertical
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DesignSystemPage() {
    const { setTheme, theme } = useTheme();
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="container mx-auto py-10 space-y-16">
        {/* HEADER */}
        <div className="flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur-sm py-4 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive showcase of shared UI components.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* ======================= FUNDAMENTALS ======================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">1. Buttons & Controls</h2>
            <Badge variant="outline">Fundamentals</Badge>
          </div>
          <Separator />

          <div className="grid gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Settings className="w-4 h-4" /></Button>
              </div>
               <div className="flex flex-wrap gap-4 items-center">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Button Group</h3>
                <ButtonGroup>
                    <Button variant="outline">Year</Button>
                    <Button variant="outline">Month</Button>
                    <Button variant="outline">Day</Button>
                </ButtonGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Toggles & Switches</h3>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms</Label>
                </div>
                 <Toggle aria-label="Toggle italic" variant="outline">
                   <span className="italic">Bold</span>
                </Toggle>
                 <ToggleGroup type="multiple">
                    <ToggleGroupItem value="a">A</ToggleGroupItem>
                    <ToggleGroupItem value="b">B</ToggleGroupItem>
                    <ToggleGroupItem value="c">C</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

             <div className="space-y-4">
              <h3 className="text-lg font-medium">Radio Group</h3>
                <RadioGroup defaultValue="option-one" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="r1" />
                    <Label htmlFor="r1">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="r2" />
                    <Label htmlFor="r2">Option Two</Label>
                  </div>
                </RadioGroup>
            </div>

            <div className="space-y-4">
                 <h3 className="text-lg font-medium">Slider</h3>
                <div className="w-[300px]">
                    <Slider defaultValue={[50]} max={100} step={1} />
                </div>
            </div>
          </div>
        </section>

        {/* ======================= INPUTS ======================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">2. Inputs & Forms</h2>
             <Badge variant="outline">Data Entry</Badge>
          </div>
           <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label>Default Input</Label>
              <Input placeholder="Type something..." />
            </div>
             <div className="space-y-2">
              <Label>Input with Icons</Label>
               <Input
                 placeholder="Search..."
                 startContent={<User className="w-4 h-4" />}
               />
            </div>
            <div className="space-y-2">
              <Label>Number Input</Label>
              <NumberInput placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Number Input (Suffix)</Label>
              <NumberInput placeholder="0" suffix="VNĐ" />
            </div>
            <div className="space-y-2">
              <Label>Input with Error</Label>
              <Input placeholder="Invalid input" isError />
            </div>
             <div className="space-y-2">
               <Label>Input OTP</Label>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
            </div>
            <div className="space-y-2 col-span-full md:col-span-1">
              <Label>Textarea</Label>
              <Textarea placeholder="Type your message here." />
            </div>
            <div className="space-y-2">
              <Label>Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
                 <Label>Calendar</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                        >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date ? date.toDateString() : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
             </div>
          </div>
        </section>

        {/* ======================= DISPLAY ======================= */}
        <section className="space-y-6">
           <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">3. Display & Feedback</h2>
             <Badge variant="outline">Visuals</Badge>
          </div>
           <Separator />

          <div className="grid gap-8">
             <div className="space-y-4">
                 <h3 className="text-lg font-medium">Badges</h3>
                 <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="violet">Violet</Badge>
                    <Badge variant="indigo">Indigo</Badge>
                    <Badge variant="emerald">Emerald</Badge>
                    <Badge variant="status-active">Active</Badge>
                 </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Toasts (Sonner)</h3>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        onClick={() => showToast.success("Operation Successful", "Your changes have been saved successfully.")}
                    >
                        Success Toast
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showToast.info("New Notification", "You have a new message from the system.")}
                    >
                        Info Toast
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showToast.warning("Warning Issued", "Please check your input before proceeding.")}
                    >
                        Warning Toast
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showToast.error("Error Occurred", "Failed to process request. Please try again.")}
                    >
                        Error Toast
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <h3 className="text-lg font-medium">Alerts</h3>
                    <Alert>
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            You can add components to your app using the cli.
                        </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Your session has expired. Please log in again.
                        </AlertDescription>
                    </Alert>
                </div>
                 <div className="space-y-4">
                     <h3 className="text-lg font-medium">Loading States</h3>
                     <div className="flex items-center gap-4">
                        <Spinner className="size-4" />
                        <Spinner className="size-8" />
                     </div>
                     <div className="space-y-2">
                         <Skeleton className="h-4 w-[250px]" />
                         <Skeleton className="h-4 w-[200px]" />
                     </div>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                 </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-lg font-medium">Avatar</h3>
                 <div className="flex gap-4">
                     <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                     <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                 </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-medium">Progress</h3>
               <Progress value={60} className="w-[60%]" />
            </div>

             <div className="space-y-4">
               <h3 className="text-lg font-medium">Tooltip</h3>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Add to library</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
          </div>
        </section>

        {/* ======================= NAVIGATION ======================= */}
       <section className="space-y-6">
           <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">4. Navigation & Layout</h2>
             <Badge variant="outline">Structure</Badge>
          </div>
           <Separator />

           <div className="grid gap-8">
              <div className="space-y-4">
                 <h3 className="text-lg font-medium">Breadcrumb</h3>
                 <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                 </Breadcrumb>
              </div>

               <div className="space-y-4">
                 <h3 className="text-lg font-medium">Tabs</h3>
                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="password" className="p-4 border rounded-md mt-2">Change your password here.</TabsContent>
                    </Tabs>
              </div>

               <div className="space-y-4">
                 <h3 className="text-lg font-medium">Tabs (Segmented)</h3>
                  <Tabs defaultValue="active" className="w-[400px]">
                    <TabsList variant="segment" fullWidth>
                        <TabsTrigger variant="segment" value="active" stretch>Active</TabsTrigger>
                        <TabsTrigger variant="segment" value="available" stretch>Available</TabsTrigger>
                        <TabsTrigger variant="segment" value="archived" stretch>Archived</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="p-4 border rounded-md mt-2">Active items content.</TabsContent>
                    <TabsContent value="available" className="p-4 border rounded-md mt-2">Available items content.</TabsContent>
                    <TabsContent value="archived" className="p-4 border rounded-md mt-2">Archived items content.</TabsContent>
                  </Tabs>
              </div>

              <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accordion</h3>
                   <Accordion type="single" collapsible className="w-full max-w-[400px]">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it styled?</AccordionTrigger>
                        <AccordionContent>
                        Yes. It comes with default styles that matches the other
                        components&apos; aesthetic.
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
              </div>

               <div className="space-y-4">
                   <h3 className="text-lg font-medium">Pagination</h3>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                            <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
               </div>
           </div>
       </section>

        {/* ======================= OVERLAYS ======================= */}
       <section className="space-y-6">
           <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">5. Overlays & Popups</h2>
             <Badge variant="outline">Interactive</Badge>
          </div>
           <Separator />

           <div className="flex flex-wrap gap-4">
               {/* Dialog */}
               <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account.
                    </DialogDescription>
                    </DialogHeader>
                     <DialogFooter>
                         <Button type="submit">Confirm</Button>
                     </DialogFooter>
                </DialogContent>
                </Dialog>

                {/* Sheet */}
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                    </SheetHeader>
                </SheetContent>
                </Sheet>

                {/* Drawer */}
                 <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
                </Drawer>

                {/* Alert Dialog */}
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Alert Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

                {/* Dropdown Menu */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Dropdown</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>

                {/* Context Menu (Area) */}
                <ContextMenu>
                <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
                    Right click here
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem inset>
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset disabled>
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                    Reload
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem>
                </ContextMenuContent>
                </ContextMenu>
           </div>
       </section>

       {/* ======================= OTHERS ======================= */}
       <section className="space-y-6">
           <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">6. Miscellaneous</h2>
             <Badge variant="outline">Others</Badge>
          </div>
           <Separator />

           <div className="grid gap-8">
               <div className="space-y-4">
                  <h3 className="text-lg font-medium">Collapsible</h3>
                   <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">
                           Toggle Collapsible
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 bg-muted/50 p-4 rounded-md">
                        @radix-ui/colors
                    </CollapsibleContent>
                    </Collapsible>
               </div>

               <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hover Card</h3>
                   <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="link">@nextjs</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/vercel.png" />
                            <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">@nextjs</h4>
                            <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                            </p>
                            <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Joined December 2021
                            </span>
                            </div>
                        </div>
                        </div>
                    </HoverCardContent>
                    </HoverCard>
               </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-medium">Aspect Ratio</h3>
                    <div className="w-[300px]">
                      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
                         Image 16:9
                      </AspectRatio>
                    </div>
               </div>

               <div className="space-y-4">
                   <h3 className="text-lg font-medium">Cards</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <p>Card Content</p>
                            </CardContent>
                            <CardFooter>
                            <p>Card Footer</p>
                            </CardFooter>
                        </Card>
                        <Card className="glass-card">
                            <CardHeader>
                            <CardTitle>Glass Card</CardTitle>
                            <CardDescription>Custom variant</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <p>This uses the .glass-card utility class.</p>
                            </CardContent>
                        </Card>
                   </div>
               </div>
           </div>
       </section>

      </div>
    );
  }
