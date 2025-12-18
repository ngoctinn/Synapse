"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { Filter, X } from "lucide-react";
import type { AppointmentFilters, AppointmentStatus, TimelineResource } from "../../types";

interface AppointmentsFilterProps {
  staffList: TimelineResource[];
  filters: Partial<AppointmentFilters>;
  onFilterChange: (newFilters: Partial<AppointmentFilters>) => void;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string; color: string }[] = [
  { value: "PENDING", label: "Chờ xác nhận", color: "bg-yellow-500" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "bg-blue-500" },
  { value: "IN_PROGRESS", label: "Đang thực hiện", color: "bg-emerald-500" },
  { value: "COMPLETED", label: "Hoàn thành", color: "bg-green-600" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-500" },
  { value: "NO_SHOW", label: "Vắng mặt", color: "bg-gray-500" },
];

export function AppointmentsFilter({
  staffList,
  filters,
  onFilterChange,
}: AppointmentsFilterProps) {
  const activeFilterCount =
    (filters.staffIds?.length || 0) + (filters.statuses?.length || 0);

  const handleStatusChange = (status: AppointmentStatus, checked: boolean) => {
    const currentStatuses = filters.statuses || [];
    let newStatuses: AppointmentStatus[];

    if (checked) {
      newStatuses = [...currentStatuses, status];
    } else {
      newStatuses = currentStatuses.filter((s) => s !== status);
    }

    onFilterChange({ ...filters, statuses: newStatuses });
  };

  const handleStaffChange = (staffId: string, checked: boolean) => {
    const currentStaffIds = filters.staffIds || [];
    let newStaffIds: string[];

    if (checked) {
      newStaffIds = [...currentStaffIds, staffId];
    } else {
      newStaffIds = currentStaffIds.filter((id) => id !== staffId);
    }

    onFilterChange({ ...filters, staffIds: newStaffIds });
  };

  const clearFilters = () => {
    onFilterChange({ ...filters, staffIds: [], statuses: [] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeFilterCount > 0 ? "secondary" : "ghost"}
          size="icon"
          className="relative h-8 w-8"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
          <span className="sr-only">Bộ lọc</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium leading-none">Bộ lọc hiển thị</h4>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              Xóa lọc
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Trạng thái
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.statuses?.includes(status.value)}
                    onCheckedChange={(checked) =>
                      handleStatusChange(status.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Staff Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Nhân viên
            </Label>
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
              {staffList.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Không có dữ liệu nhân viên
                </div>
              ) : (
                staffList.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={filters.staffIds?.includes(staff.id)}
                      onCheckedChange={(checked) =>
                        handleStaffChange(staff.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`staff-${staff.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {staff.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
