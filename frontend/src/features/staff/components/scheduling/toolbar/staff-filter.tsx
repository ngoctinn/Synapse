"use client";

import { Check, Filter, Users, X } from "lucide-react";

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
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

import { ROLE_CONFIG, ROLES } from "../../../model/constants";
import { Role, Staff } from "../../../model/types";

interface StaffFilterProps {
  staffList: Staff[];
  selectedStaffIds: string[];
  selectedRoles: Role[];
  onStaffChange: (staffIds: string[]) => void;
  onRoleChange: (roles: Role[]) => void;
  onClear: () => void;
  className?: string;
}

/**
 * Bộ lọc nhân viên và vai trò
 */
export function StaffFilter({
  staffList,
  selectedStaffIds,
  selectedRoles,
  onStaffChange,
  onRoleChange,
  onClear,
  className,
}: StaffFilterProps) {
  const hasFilters = selectedStaffIds.length > 0 || selectedRoles.length > 0;

  const toggleStaff = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      onStaffChange(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      onStaffChange([...selectedStaffIds, staffId]);
    }
  };

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      onRoleChange(selectedRoles.filter((r) => r !== role));
    } else {
      onRoleChange([...selectedRoles, role]);
    }
  };

  const filterLabel = hasFilters
    ? `${selectedStaffIds.length + selectedRoles.length} bộ lọc`
    : "Lọc";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-2 px-3",
              hasFilters && "border-primary/50 bg-primary/5 text-primary"
            )}
          >
            <Filter className="size-4" />
            <span className="hidden sm:inline">{filterLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>

              {/* Role filters */}
              <CommandGroup heading="Vai trò">
                {ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role.id as Role);
                  return (
                    <CommandItem
                      key={role.id}
                      onSelect={() => toggleRole(role.id as Role)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <Badge
                        variant={ROLE_CONFIG[role.id as Role].variant}
                        className="text-xs"
                      >
                        {role.name}
                      </Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandSeparator />

              {/* Staff filters */}
              <CommandGroup heading="Nhân viên">
                {staffList.map((staff) => {
                  const isSelected = selectedStaffIds.includes(staff.user_id);
                  return (
                    <CommandItem
                      key={staff.user_id}
                      onSelect={() => toggleStaff(staff.user_id)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="text-muted-foreground size-3" />
                        <span className="text-sm">{staff.user.full_name}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {hasFilters && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={onClear}
                      className="cursor-pointer justify-center text-center"
                    >
                      <X className="size-4" />
                      Xóa bộ lọc
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {hasFilters && (
        <div className="hidden items-center gap-1 sm:flex">
          {selectedRoles.map((role) => (
            <Badge
              key={role}
              variant={ROLE_CONFIG[role].variant}
              className="cursor-pointer text-xs hover:opacity-80"
              onClick={() => toggleRole(role)}
            >
              {ROLE_CONFIG[role].label}
              <X className="ml-1 size-3" />
            </Badge>
          ))}
          {selectedStaffIds.slice(0, 2).map((id) => {
            const staff = staffList.find((s) => s.user_id === id);
            return (
              <Badge
                key={id}
                variant="outline"
                className="cursor-pointer text-xs hover:opacity-80"
                onClick={() => toggleStaff(id)}
              >
                {staff?.user.full_name?.split(" ").pop()}
                <X className="ml-1 size-3" />
              </Badge>
            );
          })}
          {selectedStaffIds.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{selectedStaffIds.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
