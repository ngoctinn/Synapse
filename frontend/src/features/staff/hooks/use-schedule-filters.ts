"use client";

import { useCallback, useMemo, useState } from "react";
import { Role, ScheduleFilters, ScheduleStatus, Staff } from "../model/types";

interface UseScheduleFiltersProps {
  staffList: Staff[];
}

/**
 * Hook quản lý bộ lọc lịch làm việc
 */
export function useScheduleFilters({ staffList }: UseScheduleFiltersProps) {
  const [filters, setFilters] = useState<ScheduleFilters>({
    staffIds: [],
    roles: [],
    status: undefined,
  });

  // Lọc danh sách nhân viên theo filters
  const filteredStaff = useMemo(() => {
    let result = staffList;

    // Lọc theo role
    if (filters.roles.length > 0) {
      result = result.filter((s) => filters.roles.includes(s.user.role));
    }

    // Lọc theo staffIds (nếu có)
    if (filters.staffIds.length > 0) {
      result = result.filter((s) => filters.staffIds.includes(s.user_id));
    }

    return result;
  }, [staffList, filters]);

  // Check có filter nào đang active không
  const hasActiveFilters = useMemo(() => {
    return filters.staffIds.length > 0 || filters.roles.length > 0 || filters.status !== undefined;
  }, [filters]);

  // Filter handlers
  const setStaffFilter = useCallback((staffIds: string[]) => {
    setFilters((prev) => ({ ...prev, staffIds }));
  }, []);

  const setRoleFilter = useCallback((roles: Role[]) => {
    setFilters((prev) => ({ ...prev, roles }));
  }, []);

  const setStatusFilter = useCallback((status: ScheduleStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const toggleStaffFilter = useCallback((staffId: string) => {
    setFilters((prev) => ({
      ...prev,
      staffIds: prev.staffIds.includes(staffId)
        ? prev.staffIds.filter((id) => id !== staffId)
        : [...prev.staffIds, staffId],
    }));
  }, []);

  const toggleRoleFilter = useCallback((role: Role) => {
    setFilters((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      staffIds: [],
      roles: [],
      status: undefined,
    });
  }, []);

  return {
    // State
    filters,
    filteredStaff,
    hasActiveFilters,

    // Actions
    setStaffFilter,
    setRoleFilter,
    setStatusFilter,
    toggleStaffFilter,
    toggleRoleFilter,
    clearFilters,
  };
}
