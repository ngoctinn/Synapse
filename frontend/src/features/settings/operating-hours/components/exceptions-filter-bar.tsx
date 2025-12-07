"use client";
import * as React from "react";
import { Search, SlidersHorizontal, Settings2, Wrench, PartyPopper, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./date-range-filter";

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
    <div 
      className="bg-background py-3 px-4 sm:px-6 border-b flex flex-col sm:flex-row items-center justify-between gap-3 w-full shrink-0"
    >
      {/* LEFT: Search + Filters */}
      <div className="flex items-center gap-2 w-full sm:w-auto p-1 bg-background overflow-x-auto no-scrollbar">
        {/* Start Content (e.g. View Toggles) */}
        {startContent}

        {/* 1. Search */}
        <div className="relative w-full sm:w-[260px] shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm ngoại lệ"
                className="w-full pl-9 h-9 bg-background border shadow-sm focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* 2. Combined Filter Button (Type + Status + Date) */}
        <FilterButton
          isActive={paramCount > 0}
          count={paramCount}

          className="h-9 gap-2 shrink-0 border-dashed shadow-sm"
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
        
        {/* Clear All Button (Global Clear) */}
        {(activeCount > 0) && (
            <Button 
                variant="ghost" 
                size="icon"
                onClick={onClearFilters}
                className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                title="Xóa tất cả bộ lọc"
                aria-label="Xóa tất cả bộ lọc"
            >
                <X className="h-4 w-4" />
            </Button>
        )}
      </div>

      {/* RIGHT: Add Actions */}
      <div className="flex items-center gap-2">
        {endContent}
      </div>
    </div >
  );
}
