"use client";

/**
 * FilterBar - Thanh lọc cho Calendar
 *
 * Filters: KTV, Dịch vụ, Trạng thái, Search
 */

import { Check, ChevronsUpDown, Filter, Search, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

import { APPOINTMENT_STATUS_CONFIG } from "../../constants";
import type { AppointmentFilters, AppointmentStatus } from "../../types";

// ============================================
// TYPES
// ============================================

interface FilterBarProps {
  filters: AppointmentFilters;
  onFiltersChange: (filters: AppointmentFilters) => void;
  staffOptions: Array<{ id: string; name: string }>;
  serviceOptions: Array<{ id: string; name: string }>;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FilterBar({
  filters,
  onFiltersChange,
  staffOptions,
  serviceOptions,
  className,
}: FilterBarProps) {
  const [staffOpen, setStaffOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Status options
  const statusOptions: AppointmentStatus[] = [
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "no_show",
  ];

  // Count active filters
  const activeFilterCount =
    filters.staffIds.length +
    filters.serviceIds.length +
    filters.statuses.length +
    (filters.searchQuery ? 1 : 0);

  // Handlers
  const handleStaffToggle = (staffId: string) => {
    const newStaffIds = filters.staffIds.includes(staffId)
      ? filters.staffIds.filter((id) => id !== staffId)
      : [...filters.staffIds, staffId];
    onFiltersChange({ ...filters, staffIds: newStaffIds });
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServiceIds = filters.serviceIds.includes(serviceId)
      ? filters.serviceIds.filter((id) => id !== serviceId)
      : [...filters.serviceIds, serviceId];
    onFiltersChange({ ...filters, serviceIds: newServiceIds });
  };

  const handleStatusToggle = (status: AppointmentStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleClearAll = () => {
    onFiltersChange({
      staffIds: [],
      serviceIds: [],
      resourceIds: [],
      statuses: [],
      searchQuery: "",
    });
  };

  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "staff":
        onFiltersChange({
          ...filters,
          staffIds: filters.staffIds.filter((id) => id !== value),
        });
        break;
      case "service":
        onFiltersChange({
          ...filters,
          serviceIds: filters.serviceIds.filter((id) => id !== value),
        });
        break;
      case "status":
        onFiltersChange({
          ...filters,
          statuses: filters.statuses.filter((s) => s !== value),
        });
        break;
      case "search":
        onFiltersChange({ ...filters, searchQuery: "" });
        break;
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm khách hàng, dịch vụ..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Staff Filter */}
        <Popover open={staffOpen} onOpenChange={setStaffOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9",
                filters.staffIds.length > 0 && "border-primary"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Kỹ thuật viên
              {filters.staffIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.staffIds.length}
                </Badge>
              )}
              <ChevronsUpDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm KTV..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {staffOptions.map((staff) => (
                    <CommandItem
                      key={staff.id}
                      value={staff.id}
                      onSelect={() => handleStaffToggle(staff.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.staffIds.includes(staff.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {staff.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Service Filter */}
        <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9",
                filters.serviceIds.length > 0 && "border-primary"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Dịch vụ
              {filters.serviceIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.serviceIds.length}
                </Badge>
              )}
              <ChevronsUpDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm dịch vụ..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {serviceOptions.map((service) => (
                    <CommandItem
                      key={service.id}
                      value={service.id}
                      onSelect={() => handleServiceToggle(service.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.serviceIds.includes(service.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {service.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9",
                filters.statuses.length > 0 && "border-primary"
              )}
            >
              Trạng thái
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.statuses.length}
                </Badge>
              )}
              <ChevronsUpDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {statusOptions.map((status) => {
                    const config = APPOINTMENT_STATUS_CONFIG[status];
                    return (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={() => handleStatusToggle(status)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.statuses.includes(status)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            config.bgColor
                          )}
                        />
                        {config.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground"
            onClick={handleClearAll}
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Applied Filters Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* Staff chips */}
          {filters.staffIds.map((staffId) => {
            const staff = staffOptions.find((s) => s.id === staffId);
            return (
              <Badge
                key={`staff-${staffId}`}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {staff?.name || staffId}
                <button
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  onClick={() => handleRemoveFilter("staff", staffId)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Service chips */}
          {filters.serviceIds.map((serviceId) => {
            const service = serviceOptions.find((s) => s.id === serviceId);
            return (
              <Badge
                key={`service-${serviceId}`}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {service?.name || serviceId}
                <button
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  onClick={() => handleRemoveFilter("service", serviceId)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Status chips */}
          {filters.statuses.map((status) => {
            const config = APPOINTMENT_STATUS_CONFIG[status];
            return (
              <Badge
                key={`status-${status}`}
                variant="secondary"
                className={cn("gap-1 pr-1", config.bgColor, config.color)}
              >
                {config.label}
                <button
                  className="ml-1 rounded-full hover:bg-muted/50 p-0.5"
                  onClick={() => handleRemoveFilter("status", status)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Search chip */}
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1 pr-1">
              &quot;{filters.searchQuery}&quot;
              <button
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={() => handleRemoveFilter("search", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
