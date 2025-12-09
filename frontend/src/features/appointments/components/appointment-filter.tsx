"use client"

import * as React from "react"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"
import {
    Check,
    Circle,
    Search,
    SlidersHorizontal,
    User,
    CalendarCheck, // Using a more specific icon for status if needed, or stick to simple dots
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { Button } from "@/shared/ui/button"
import { useState, useMemo } from "react"
import { DateRangeFilter } from "@/shared/ui/custom/date-range-filter"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

// --- Configuration ---

// Mock data staff - Should be replaced with API data
const STAFF_OPTIONS = [
    { id: "1", name: "Nguyễn Văn A", role: "Senior Stylist" },
    { id: "2", name: "Trần Thị B", role: "Junior Stylist" },
    { id: "3", name: "Lê Văn C", role: "Trainee" },
]

const STATUS_OPTIONS = [
    {
        value: "pending",
        label: "Chờ xác nhận",
        activeClass: "data-[state=on]:bg-amber-100 dark:data-[state=on]:bg-amber-900/30 data-[state=on]:text-amber-700 dark:data-[state=on]:text-amber-400 data-[state=on]:border-amber-200 border-transparent",
        dotClass: "bg-amber-500",
    },
    {
        value: "confirmed",
        label: "Đã xác nhận",
        activeClass: "data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-700 dark:data-[state=on]:text-blue-400 data-[state=on]:border-blue-200 border-transparent",
        dotClass: "bg-blue-500",
    },
    {
        value: "serving",
        label: "Đang phục vụ",
        activeClass: "data-[state=on]:bg-indigo-100 dark:data-[state=on]:bg-indigo-900/30 data-[state=on]:text-indigo-700 dark:data-[state=on]:text-indigo-400 data-[state=on]:border-indigo-200 border-transparent",
        dotClass: "bg-indigo-500",
    },
    {
        value: "completed",
        label: "Hoàn thành",
        activeClass: "data-[state=on]:bg-emerald-100 dark:data-[state=on]:bg-emerald-900/30 data-[state=on]:text-emerald-700 dark:data-[state=on]:text-emerald-400 data-[state=on]:border-emerald-200 border-transparent",
        dotClass: "bg-emerald-500",
    },
    {
        value: "cancelled",
        label: "Đã hủy",
        activeClass: "data-[state=on]:bg-slate-100 dark:data-[state=on]:bg-slate-800/50 data-[state=on]:text-slate-700 dark:data-[state=on]:text-slate-400 data-[state=on]:border-slate-200 border-transparent",
        dotClass: "bg-slate-500",
    },
    {
        value: "no-show",
        label: "Không đến",
        activeClass: "data-[state=on]:bg-rose-100 dark:data-[state=on]:bg-rose-900/30 data-[state=on]:text-rose-700 dark:data-[state=on]:text-rose-400 data-[state=on]:border-rose-200 border-transparent",
        dotClass: "bg-rose-500",
    },
]

interface AppointmentFilterProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    className?: string;
    viewMode?: "list" | "calendar" | "timeline";
}

export function AppointmentFilter({ startContent, endContent, className, viewMode = "list" }: AppointmentFilterProps) {
    const { searchParams, activeCount, updateParam, updateParams, clearFilters } =
        useFilterParams({
            filterKeys: ["status", "staffId", "q", "from", "to"],
        })

    const statusParam = searchParams.get("status")
    const staffIdParam = searchParams.get("staffId")
    const searchQuery = searchParams.get("q") || ""
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const [openStaff, setOpenStaff] = useState(false)

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
        
        // Use format to keep URL simple (YYYY-MM-DD) or ISOString if strict time needed.
        // For appointments filter, usually YYYY-MM-DD is sufficient.
        updateParams({
            from: range.from ? format(range.from, "yyyy-MM-dd") : null,
            to: range.to ? format(range.to, "yyyy-MM-dd") : null
        })
    }

    // Parse multi-select values
    const selectedStatuses = statusParam ? statusParam.split(",") : []
    const selectedStaffIds = staffIdParam ? staffIdParam.split(",") : []

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

    const handleSearch = (term: string) => {
        updateParam("q", term || null)
    }

    // Computed
    const selectedStaffObjects = STAFF_OPTIONS.filter((s) => selectedStaffIds.includes(s.id))

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

    return (
        <div className={cn("bg-background border-b px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 w-full shrink-0 transition-all duration-200 sticky top-0 z-50", className)}>
            {/* LEFT: Start Content (View Toggles/Tabs) */}
            <div className="w-full md:w-auto flex justify-start order-2 md:order-1 overflow-x-auto no-scrollbar">
                {startContent}
            </div>

            {/* RIGHT: Search + Filters + Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-2">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none">
                    <SearchInput
                        placeholder="Tìm kiếm lịch hẹn..."
                        value={searchQuery}
                        onSearch={handleSearch}
                        className="w-full sm:w-[200px] lg:w-[250px]"
                        variant="sm"
                    />

                    {/* Date Range Filter (List View Only) */}
                    {viewMode === "list" && (
                         <DateRangeFilter 
                            dateRange={dateRange}
                            setDateRange={handleDateRangeChange}
                            className="w-[240px] hidden lg:flex"
                        />
                    )}

                    {/* Combined Filter Button */}
                    <FilterButton
                        isActive={activeCount > 0}
                        count={activeCount}
                        onClear={clearFilters}
                        className="h-9 w-9 gap-2 shrink-0 border-dashed shadow-sm"
                        icon={SlidersHorizontal}
                    >
                        <div className="w-full flex flex-col gap-4 p-1">
                            {/* Date Range Section (Mobile/Popout) */}
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

                            {/* Status Section */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                                    Trạng thái
                                </h4>
                                <ToggleGroup
                                    type="multiple"
                                    value={selectedStatuses}
                                    onValueChange={handleStatusChange}
                                    className="justify-start gap-2 w-full flex-wrap"
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <ToggleGroupItem
                                            key={status.value}
                                            value={status.value}
                                            size="sm"
                                            className={cn(
                                                "flex-1 min-w-[100px] border border-transparent transition-all",
                                                status.activeClass
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", status.dotClass)} />
                                            {status.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
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
                                            className={cn(
                                                "w-full justify-between font-normal hover:bg-accent hover:text-accent-foreground",
                                                selectedStaffIds.length > 0 && "border-primary/50 bg-primary/5 text-primary"
                                            )}
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
                                                    {STAFF_OPTIONS.map((staff) => {
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

                {/* End Content (Add Button) */}
                {endContent && (
                    <div className="shrink-0 flex items-center">
                        {endContent}
                    </div>
                )}
            </div>
        </div>
    )
}
