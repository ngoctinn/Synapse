"use client"

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import { DateRangeFilter } from "@/shared/ui/custom/date-range-filter"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { Input } from "@/shared/ui/input"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"
import { format } from "date-fns"
import {
  Check,
  Circle,
  Search,
  SlidersHorizontal,
  Sparkles,
  User
} from "lucide-react"
import * as React from "react"
import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"

import { API_SERVICE_OPTIONS, API_STAFF_OPTIONS, APPOINTMENT_STATUS_CONFIG, APPOINTMENT_STATUSES } from "../config"

// --- Constants & Helpers ---
const TOGGLE_ITEM_BASE_CLASSES = cn(
    "w-full justify-start px-2 border rounded-none transition-all duration-200",
    "border-input hover:border-accent-foreground/20 hover:bg-accent/50",
    "data-[state=on]:border-transparent",
    "active:scale-[0.98]"
);

const getSelectTriggerClass = (hasValue: boolean) => cn(
    "w-full justify-between font-normal hover:bg-accent hover:text-accent-foreground",
    hasValue && "border-primary/50 bg-primary/5 text-primary"
);

const getStatusToggleStyles = (statusValue: string) => {
    const map: Record<string, string> = {
        pending: "data-[state=on]:bg-status-pending data-[state=on]:text-status-pending-foreground data-[state=on]:border-status-pending-border",
        confirmed: "data-[state=on]:bg-status-confirmed data-[state=on]:text-status-confirmed-foreground data-[state=on]:border-status-confirmed-border",
        serving: "data-[state=on]:bg-status-serving data-[state=on]:text-status-serving-foreground data-[state=on]:border-status-serving-border",
        completed: "data-[state=on]:bg-status-completed data-[state=on]:text-status-completed-foreground data-[state=on]:border-status-completed-border",
        cancelled: "data-[state=on]:bg-status-cancelled data-[state=on]:text-status-cancelled-foreground data-[state=on]:border-status-cancelled-border",
        "no-show": "data-[state=on]:bg-status-noshow data-[state=on]:text-status-noshow-foreground data-[state=on]:border-status-noshow-border",
    };
    return map[statusValue] || "";
}

const getStatusDotColor = (statusValue: string) => {
     const config = APPOINTMENT_STATUS_CONFIG[statusValue];
     return config ? config.styles.indicator : "bg-muted-foreground";
}

interface AppointmentFilterProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    className?: string;
    viewMode?: "list" | "calendar" | "timeline";
}

export function AppointmentFilter({ startContent, endContent, className, viewMode = "list" }: AppointmentFilterProps) {
    const { searchParams, activeCount, updateParam, updateParams, clearFilters } =
        useFilterParams({
            filterKeys: ["status", "staffId", "serviceId", "q", "from", "to"],
        })

    const statusParam = searchParams.get("status")
    const staffIdParam = searchParams.get("staffId")
    const serviceIdParam = searchParams.get("serviceId")
    const searchQuery = searchParams.get("q") || ""
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const [openStaff, setOpenStaff] = useState(false)
    const [openService, setOpenService] = useState(false)

    // Parse date params
    const dateRange = useMemo<DateRange | undefined>(() => {
        if (!fromParam) return undefined
        return {
            from: new Date(fromParam),
            to: toParam ? new Date(toParam) : undefined
        }
    }, [fromParam, toParam])

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (!range) {
            updateParams({ from: null, to: null })
            return
        }

        updateParams({
            from: range.from ? format(range.from, "yyyy-MM-dd") : null,
            to: range.to ? format(range.to, "yyyy-MM-dd") : null
        })
    }


    const selectedStatuses = statusParam ? statusParam.split(",") : []
    const selectedStaffIds = staffIdParam ? staffIdParam.split(",") : []
    const selectedServiceIds = serviceIdParam ? serviceIdParam.split(",") : []

    // Handlers
    const handleStatusChange = (values: string[]) => {
        const uniqueValues = Array.from(new Set(values))
        updateParam("status", uniqueValues.length > 0 ? uniqueValues.join(",") : null)
    }

    const handleStaffSelect = (value: string | null) => {
        if (!value) {
            updateParam("staffId", null)
            return
        }

        const currentIds = new Set(selectedStaffIds)
        if (currentIds.has(value)) {
            currentIds.delete(value)
        } else {
            currentIds.add(value)
        }

        const newIds = Array.from(currentIds)
        updateParam("staffId", newIds.length > 0 ? newIds.join(",") : null)
    }

    const handleServiceSelect = (value: string | null) => {
        if (!value) {
            updateParam("serviceId", null)
            return
        }

        const currentIds = new Set(selectedServiceIds)
        if (currentIds.has(value)) {
            currentIds.delete(value)
        } else {
            currentIds.add(value)
        }

        const newIds = Array.from(currentIds)
        updateParam("serviceId", newIds.length > 0 ? newIds.join(",") : null)
    }

    const handleSearch = (term: string) => {
        updateParam("q", term || null)
    }

    // Computed
    const selectedStaffObjects = API_STAFF_OPTIONS.filter((s) => selectedStaffIds.includes(s.id))
    const selectedServiceObjects = API_SERVICE_OPTIONS.filter((s) => selectedServiceIds.includes(s.id))

    const renderStaffLabel = () => {
        if (selectedStaffIds.length === 0) return <span className="text-muted-foreground">Chọn nhân viên...</span>

        const count = selectedStaffIds.length

        if (count === 1) {
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{selectedStaffObjects[0]?.name}</span>
                </div>
            )
        }

        if (count <= 2) {
             return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{selectedStaffObjects.map(s => s.name).join(", ")}</span>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                <span className="font-medium">{count} nhân viên</span>
            </div>
        )
    }

    const renderServiceLabel = () => {
        if (selectedServiceIds.length === 0) return <span className="text-muted-foreground">Chọn dịch vụ...</span>

        const count = selectedServiceIds.length

        if (count === 1) {
            return (
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="truncate">{selectedServiceObjects[0]?.name}</span>
                </div>
            )
        }

        if (count <= 2) {
                return (
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="truncate">{selectedServiceObjects.map(s => s.name).join(", ")}</span>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="font-medium">{count} dịch vụ</span>
            </div>
        )
    }

    return (
        <div className={cn("bg-background border-b px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 w-full shrink-0 transition-all duration-200 sticky top-0 z-50", className)}>

            <div className="w-full md:w-auto flex justify-start order-2 md:order-1 overflow-x-auto no-scrollbar">
                {startContent}
            </div>


            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-2">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none">
                    <div className="relative w-full sm:w-[200px] lg:w-[250px]">
                        <Input
                            placeholder="Tìm kiếm lịch hẹn..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                            startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                            endContent={
                                searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSearch("")}
                                        className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <div className="sr-only">Clear</div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="size-3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                ) : (
                                    <div className="hidden sm:flex items-center gap-1 pointer-events-none opacity-50">
                                         <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 dark:shadow-none">
                                           <span className="text-xs">⌘</span>K
                                         </kbd>
                                    </div>
                                )
                            }
                            className="h-9 bg-background border-input/50 focus-visible:ring-primary/20"
                        />
                    </div>


                    {viewMode === "list" && (
                         <DateRangeFilter
                            dateRange={dateRange}
                            setDateRange={handleDateRangeChange}
                            className="w-[240px] hidden lg:flex"
                        />
                    )}


                    <FilterButton
                        isActive={activeCount > 0}
                        count={activeCount}
                        onClear={clearFilters}
                        className="h-9 w-9 gap-2 shrink-0 border-dashed shadow-sm"
                        icon={SlidersHorizontal}
                    >
                        <div className="w-full flex flex-col gap-4 p-1">

                            {viewMode === "list" && (
                                <>
                                    <div className="space-y-2 lg:hidden">
                                        <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                                            Thời gian
                                        </h4>
                                        <DateRangeFilter
                                            dateRange={dateRange}
                                            setDateRange={handleDateRangeChange}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="h-px bg-border/50 lg:hidden" />
                                </>
                            )}


                            <div className="space-y-2">
                                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                                    Trạng thái
                                </h4>
                                <ToggleGroup
                                    type="multiple"
                                    spacing={2}
                                    value={selectedStatuses.length === 0 ? ["all"] : selectedStatuses}
                                    onValueChange={(newValues) => {
                                        if (newValues.includes("all")) {
                                             if (selectedStatuses.length > 0) {
                                                 updateParam("status", null);
                                                 return;
                                             }
                                        }
                                        const realStatuses = newValues.filter(v => v !== "all");
                                        updateParam("status", realStatuses.length > 0 ? realStatuses.join(",") : null);
                                    }}
                                    className="grid grid-cols-2 gap-2 w-full"
                                >
                                    {/* Select All Option - Full Width */}
                                    <ToggleGroupItem
                                        value="all"
                                        size="sm"
                                        className={cn(
                                            "col-span-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                                            TOGGLE_ITEM_BASE_CLASSES
                                        )}
                                    >
                                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2 shrink-0 bg-primary")} />
                                        <span className="truncate text-xs font-medium">Tất cả trạng thái</span>
                                    </ToggleGroupItem>

                                    {APPOINTMENT_STATUSES.map((status) => (
                                        <ToggleGroupItem
                                            key={status.value}
                                            value={status.value}
                                            size="sm"
                                            className={cn(
                                                TOGGLE_ITEM_BASE_CLASSES,
                                                getStatusToggleStyles(status.value)
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2 shrink-0", getStatusDotColor(status.value))} />
                                            <span className="truncate text-xs">{status.label}</span>
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            <div className="h-px bg-border/50" />

                            {/* Service Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                                        Dịch vụ
                                    </h4>
                                    {selectedServiceIds.length > 0 && (
                                        <button
                                            type="button"
                                            className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                                            onClick={() => updateParam("serviceId", null)}
                                        >
                                            Xóa ({selectedServiceIds.length})
                                        </button>
                                    )}
                                </div>
                                <Popover open={openService} onOpenChange={setOpenService}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openService}
                                            className={getSelectTriggerClass(selectedServiceIds.length > 0)}
                                        >
                                            {renderServiceLabel()}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Tìm dịch vụ..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy dịch vụ.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="all"
                                                        onSelect={() => handleServiceSelect(null)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            <Circle className="h-4 w-4 text-muted-foreground" />
                                                            <span>Tất cả dịch vụ</span>
                                                        </div>
                                                        {selectedServiceIds.length === 0 && <Check className="ml-auto h-4 w-4 text-primary" />}
                                                    </CommandItem>
                                                    {API_SERVICE_OPTIONS.map((service) => {
                                                        const isSelected = selectedServiceIds.includes(service.id)
                                                        return (
                                                            <CommandItem
                                                                key={service.id}
                                                                value={service.name}
                                                                onSelect={() => handleServiceSelect(service.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Sparkles className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                                    <div className="flex flex-col text-left">
                                                                        <span className={cn("text-sm", isSelected && "font-medium text-primary")}>
                                                                            {service.name}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">{service.duration} phút • {service.price.toLocaleString()}đ</span>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                                )}
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="h-px bg-border/50" />

                            {/* Staff Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                                        Nhân viên
                                    </h4>
                                    {selectedStaffIds.length > 0 && (
                                        <button
                                            type="button"
                                            className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                                            onClick={() => updateParam("staffId", null)}
                                        >
                                            Xóa ({selectedStaffIds.length})
                                        </button>
                                    )}
                                </div>
                                <Popover open={openStaff} onOpenChange={setOpenStaff}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openStaff}
                                            className={getSelectTriggerClass(selectedStaffIds.length > 0)}
                                        >
                                            {renderStaffLabel()}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Tìm nhân viên..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="all"
                                                        onSelect={() => handleStaffSelect(null)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            <Circle className="h-4 w-4 text-muted-foreground" />
                                                            <span>Tất cả nhân viên</span>
                                                        </div>
                                                        {selectedStaffIds.length === 0 && <Check className="ml-auto h-4 w-4 text-primary" />}
                                                    </CommandItem>
                                                    {API_STAFF_OPTIONS.map((staff) => {
                                                        const isSelected = selectedStaffIds.includes(staff.id)
                                                        return (
                                                            <CommandItem
                                                                key={staff.id}
                                                                value={staff.name}
                                                                onSelect={() => handleStaffSelect(staff.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <User className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                                    <div className="flex flex-col text-left">
                                                                        <span className={cn("text-sm", isSelected && "font-medium text-primary")}>
                                                                            {staff.name}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">{staff.role}</span>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                                )}
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </FilterButton>
                </div>


                {endContent && (
                    <div className="shrink-0 flex items-center">
                        {endContent}
                    </div>
                )}
            </div>
        </div>
    )
}
