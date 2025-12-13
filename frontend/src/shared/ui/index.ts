/**
 * Design System - Public API (Barrel Export)
 *
 * QUAN TRỌNG: Đây là ĐIỂM TRUY CẬP DUY NHẤT cho các components UI.
 * Developer chỉ nên import từ file này, không import trực tiếp từ các file riêng lẻ.
 *
 * @example
 * // ✅ ĐÚNG
 * import { Dialog, Badge, Button } from "@/shared/ui"
 *
 * // ❌ SAI - Không khuyến khích
 * import { Dialog } from "@/shared/ui/dialog"
 */

// ==========================================
// CUSTOM COMPONENTS (PREFERRED - Ưu tiên sử dụng)
// ==========================================

export { AnimatedUsersIcon } from "./custom/animated-icon"
export { AnimatedTableRow } from "./custom/animated-table-row"
export { DataTable } from "./custom/data-table"
export { DataTableEmptyState } from "./custom/data-table-empty-state"
export { DataTableSkeleton } from "./custom/data-table-skeleton"
export { DatePicker } from "./custom/date-picker"
export { DateRangeFilter } from "./custom/date-range-filter"
export { DeleteConfirmDialog } from "./custom/delete-confirm-dialog"
export { ConfirmDialog } from "./custom/confirm-dialog"
// Dialog primitive
export { Dialog } from "./dialog"
export { DurationPicker } from "./custom/duration-picker"
export { FilterButton } from "./custom/filter-button"
export { MaskedDateInput } from "./custom/masked-date-input"
export { PaginationControls } from "./custom/pagination-controls"
export { RequiredMark } from "./custom/required-mark"
export { OptionalMark } from "./custom/optional-mark"
export { SettingsHeader } from "./custom/settings-header"

export { TableActionBar } from "./custom/table-action-bar"
export { TableRowActions } from "./custom/table-row-actions"
export { TagInput } from "./custom/tag-input"
export { TimeInput } from "./custom/time-input"
export { TimePicker } from "./custom/time-picker"
export { TimeRangeInput } from "./custom/time-range-input"
export { YearPicker } from "./custom/year-picker"
export {
  DialogClose, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader, DialogOverlay,
  DialogPortal, DialogTitle,
  DialogTrigger
} from "./dialog"

// Sonner Toast
export { Toaster, showToast } from "./sonner"

// ==========================================
// CORE COMPONENTS (Đã được chuẩn hóa)
// ==========================================

export { Button, buttonVariants, type ButtonProps } from "./button"

export { Checkbox } from "./checkbox"
export { Input } from "./input"
export { Label } from "./label"
export { RadioGroup, RadioGroupItem } from "./radio-group"
export { Switch } from "./switch"
export { Textarea } from "./textarea"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "./select"

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from "./form"

export { Field, FieldGroup } from "./field"
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "./input-group"

// ==========================================
// LAYOUT & STRUCTURE
// ==========================================

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable"
export { ScrollArea, ScrollBar } from "./scroll-area"
export { Separator } from "./separator"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

// ==========================================
// OVERLAY COMPONENTS
// ==========================================

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from "./drawer"
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover"
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./alert-dialog"

// ==========================================
// FEEDBACK COMPONENTS
// ==========================================

export { Alert, AlertDescription, AlertTitle } from "./alert"
export { Empty } from "./empty"
export { Progress } from "./progress"
export { Skeleton } from "./skeleton"
export { Spinner } from "./spinner"

// Badge - Export both for flexibility
export { Badge, badgeVariants } from "./badge"

// ==========================================
// NAVIGATION & MENU
// ==========================================

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./breadcrumb"

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport
} from "./navigation-menu"

export {
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
  DropdownMenuTrigger
} from "./dropdown-menu"

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "./context-menu"

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "./menubar"

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "./command"

// ==========================================
// TABLE & DATA DISPLAY
// ==========================================

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"

// ==========================================
// SPECIALIZED COMPONENTS
// ==========================================

export { AspectRatio } from "./aspect-ratio"
export { Avatar, AvatarFallback, AvatarImage } from "./avatar"
export { ButtonGroup } from "./button-group"
export { Calendar } from "./calendar"
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel"
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp"
export { Item } from "./item"
export { Kbd } from "./kbd"
export { Slider } from "./slider"
export { Toggle, toggleVariants } from "./toggle"
export { ToggleGroup, ToggleGroupItem } from "./toggle-group"

// Chart components
export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent, type ChartConfig
} from "./chart"

// Sidebar components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader, SidebarInput, SidebarInset, SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "./sidebar"

