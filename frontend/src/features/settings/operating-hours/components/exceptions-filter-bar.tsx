"use client";
import { cn } from "@/shared/lib/utils";
import { DateRangeFilter } from "@/shared/ui/custom/date-range-filter";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { Input } from "@/shared/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { PartyPopper, Search, Settings2, SlidersHorizontal, Wrench, X } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface ExceptionsFilterBarProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;

  typeFilter: string[];
  setTypeFilter: (types: string[] | null) => void;

  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;

  onClearFilters: () => void;
  activeCount: number;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const FILTER_TYPES = [
  {
    id: 'holiday',
    label: 'Ngày lễ',
    icon: PartyPopper,
    activeClass: "data-[state=on]:bg-red-100 dark:data-[state=on]:bg-red-900/30 data-[state=on]:text-red-900 dark:data-[state=on]:text-red-200 data-[state=on]:border-red-200 dark:data-[state=on]:border-red-800"
  },
  {
    id: 'custom',
    label: 'Tùy chỉnh',
    icon: Settings2,
    activeClass: "data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-900 dark:data-[state=on]:text-blue-200 data-[state=on]:border-blue-200 dark:data-[state=on]:border-blue-800"
  },
  {
    id: 'maintenance',
    label: 'Bảo trì',
    icon: Wrench,
    activeClass: "data-[state=on]:bg-amber-100 dark:data-[state=on]:bg-amber-900/30 data-[state=on]:text-amber-900 dark:data-[state=on]:text-amber-200 data-[state=on]:border-amber-200 dark:data-[state=on]:border-amber-800"
  }
];

export function ExceptionsFilterBar({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dateRange,
  setDateRange,
  onClearFilters,
  activeCount,
  searchQuery,
  setSearchQuery,
  startContent,
  endContent
}: ExceptionsFilterBarProps) {

  // Calculate count for the combined filter button (Type + Status + Date)
  const paramCount = (typeFilter?.length || 0) + (statusFilter ? 1 : 0) + (dateRange?.from ? 1 : 0);

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 w-full shrink-0 transition-all duration-200 support-[backdrop-filter]:bg-background/60">
      {/* LEFT: Start Content (View Toggles) */}
      <div className="w-full md:w-auto flex justify-start order-2 md:order-1 overflow-x-auto no-scrollbar">
        {startContent}
      </div>

      {/* RIGHT: Search + Filters + Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-2">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 md:flex-none">
            <div className="relative w-full sm:w-[200px] lg:w-[250px]">
                <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search className="size-4 text-muted-foreground" />}
                    endContent={
                        searchQuery ? (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Clear</span>
                            </button>
                        ) : null
                    }
                    className="h-9 bg-background"
                />
            </div>

            {/* Combined Filter Button */}
            <FilterButton
              isActive={paramCount > 0}
              count={paramCount}
              onClear={onClearFilters}
              className="h-9 w-9 gap-2 shrink-0 border-dashed shadow-sm"
              icon={SlidersHorizontal}
            >
              <div className="w-full flex flex-col gap-4 p-1">
                {/* Date Range Section */}
                <div className="space-y-2">
                   <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                     Thời gian
                   </h4>
                   <DateRangeFilter
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        className="w-full shadow-sm"
                    />
                </div>
                <div className="h-px bg-border/50" />

                {/* Status Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                    Trạng thái
                  </h4>
                  <ToggleGroup
                      type="single"
                      value={statusFilter || ""}
                      onValueChange={(val) => setStatusFilter(val || null)}
                      className="justify-start gap-2 w-full"
                  >
                      <ToggleGroupItem
                        value="open"
                        size="sm"
                        className="flex-1 data-[state=on]:bg-emerald-100 dark:data-[state=on]:bg-emerald-900/30 data-[state=on]:text-emerald-700 dark:data-[state=on]:text-emerald-400 data-[state=on]:border-emerald-200 border border-transparent"
                      >
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                         Mở cửa
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="closed"
                        size="sm"
                        className="flex-1 data-[state=on]:bg-rose-100 dark:data-[state=on]:bg-rose-900/30 data-[state=on]:text-rose-700 dark:data-[state=on]:text-rose-400 data-[state=on]:border-rose-200 border border-transparent"
                      >
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                         Đóng cửa
                      </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="h-px bg-border/50" />

                {/* Type Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider px-1">
                    Loại ngoại lệ
                  </h4>
                   <ToggleGroup
                      type="multiple"
                      value={typeFilter}
                      onValueChange={(val) => setTypeFilter(val.length ? val : null)}
                      className="flex w-full gap-2"
                  >
                      {FILTER_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                              <ToggleGroupItem
                                  key={type.id}
                                  value={type.id}
                                  aria-label={type.label}
                                  size="sm"
                                  className={cn(
                                    "flex-1 justify-center whitespace-nowrap gap-2 px-3 h-8 border border-transparent transition-all",
                                    type.activeClass
                                  )}
                              >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span className="text-xs">{type.label}</span>
                              </ToggleGroupItem>
                          );
                      })}
                  </ToggleGroup>
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
    </div >
  );
}
