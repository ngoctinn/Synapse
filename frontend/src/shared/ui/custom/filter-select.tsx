"use client";

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/**
 * Option cho FilterSelect
 */
interface FilterSelectOption {
  /** Giá trị của option */
  value: string;
  /** Label hiển thị */
  label: string;
  /** Icon (optional) */
  icon?: LucideIcon;
  /** Custom icon color class */
  iconClassName?: string;
}

/**
 * Props cho FilterSelect
 */
interface FilterSelectProps {
  /** Key của URL param */
  paramKey: string;

  /** Danh sách options */
  options: FilterSelectOption[];

  /** Label cho "All" option */
  allLabel?: string;

  /** Label hiển thị phía trên Select */
  label?: string;

  /** Placeholder cho Select */
  placeholder?: string;

  /** HTML id cho Select */
  id?: string;

  /** Custom className cho container */
  className?: string;

  /** Icon mặc định cho tất cả options (nếu option không có icon riêng) */
  defaultIcon?: LucideIcon;

  /** Có hiển thị separator sau không */
  withSeparator?: boolean;

  /** Custom handler thay vì sử dụng useFilterParams */
  customHandler?: {
    value: string | null;
    onChange: (value: string | null) => void;
  };
}

/**
 * FilterSelect component - Select tự động integrate với URL params.
 * Giảm boilerplate code trong các filter components.
 *
 * @example
 * ```tsx
 * // Sử dụng với useFilterParams tự động
 * <FilterSelect
 *   paramKey="role"
 *   label="Vai trò"
 *   options={[
 *     { value: "admin", label: "Quản trị viên", icon: Shield },
 *     { value: "technician", label: "Kỹ thuật viên", icon: Wrench },
 *   ]}
 *   allLabel="Tất cả vai trò"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Với custom handler
 * <FilterSelect
 *   paramKey="status"
 *   options={STATUS_OPTIONS}
 *   customHandler={{
 *     value: selectedStatus,
 *     onChange: setSelectedStatus,
 *   }}
 * />
 * ```
 */
export function FilterSelect({
  paramKey,
  options,
  allLabel = "Tất cả",
  label,
  placeholder,
  id,
  className,
  defaultIcon,
  withSeparator = false,
  customHandler,
}: FilterSelectProps) {
  // Sử dụng hook nếu không có custom handler
  const filterParams = useFilterParams({
    filterKeys: [paramKey],
  });

  // Lấy value và handler
  const currentValue =
    customHandler?.value ?? filterParams.searchParams.get(paramKey);
  const handleChange = (value: string) => {
    const newValue = value === "all" ? null : value;
    if (customHandler) {
      customHandler.onChange(newValue);
    } else {
      filterParams.updateParam(paramKey, newValue);
    }
  };

  const selectId = id || paramKey;

  return (
    <div className={className}>
      <div className="space-y-3">
        {label && (
          <Label htmlFor={selectId} className="text-sm font-medium">
            {label}
          </Label>
        )}
        <Select value={currentValue || "all"} onValueChange={handleChange}>
          <SelectTrigger id={selectId} className="h-10 w-full bg-background">
            <SelectValue placeholder={placeholder || allLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{allLabel}</SelectItem>
            {options.map((option) => {
              const Icon = option.icon || defaultIcon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon
                        className={`size-4 ${
                          option.iconClassName || "text-muted-foreground"
                        }`}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      {withSeparator && <div className="h-[1px] bg-border/50 mt-6" />}
    </div>
  );
}

/**
 * Wrapper component cho nhiều FilterSelect trong một FilterButton
 */
interface FilterSelectGroupProps {
  children: ReactNode;
  className?: string;
}

export function FilterSelectGroup({
  children,
  className = "grid gap-6 p-1",
}: FilterSelectGroupProps) {
  return <div className={className}>{children}</div>;
}
