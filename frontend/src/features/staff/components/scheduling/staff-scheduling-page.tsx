"use client";

import { MousePointer2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

import { useScheduleFilters } from "../../hooks/use-schedule-filters";
import { useScheduleNavigation } from "../../hooks/use-schedule-navigation";
import { useSchedules } from "../../hooks/use-schedules";
import type { Schedule, ScheduleWithShift, Shift, Staff } from "../../model/types";

import { MonthView, WeekView } from "./calendar";
import { ShiftLegend } from "./legend";
import { SelectionToolbar, useSelection } from "./selection";
import { AddScheduleSheet, ScheduleDetailSheet, ShiftManagerSheet } from "./sheets";
import { ActionBar, DateNavigator, StaffFilter, ViewSwitcher } from "./toolbar";

interface StaffSchedulingPageProps {
  initialSchedules: Schedule[];
  staffList: Staff[];
  className?: string;
}

/**
 * Component chính quản lý toàn bộ Staff Scheduling
 */
export function StaffSchedulingPage({
  initialSchedules,
  staffList,
  className,
}: StaffSchedulingPageProps) {
  // Navigation hook
  const {
    currentDate,
    view,
    dateRange,
    weekDays,
    formattedDateRange,
    isToday,
    goToPrev,
    goToNext,
    goToToday,
    goToDate,
    changeView,
  } = useScheduleNavigation();

  // Filters hook
  const { filters, filteredStaff, setStaffFilter, setRoleFilter, clearFilters } =
    useScheduleFilters({ staffList });

  // Schedules hook
  const {
    schedules,
    draftSchedules,
    addSchedule,
    removeSchedule,
    publishSchedule,
    batchAddSchedules,
    batchRemoveSchedules,
    batchPublishSchedules,
    getSchedulesForCell,
  } = useSchedules({ initialSchedules });

  // Selection hook
  const {
    selectedSlots,
    selectionMode,
    selectedCount,
    toggleSelectionMode,
    disableSelectionMode,
    toggleSlot,
    clearSelection,
  } = useSelection();

  // Sheet states
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [shiftManagerOpen, setShiftManagerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ staffId: string; date: Date } | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithShift | null>(null);

  // Handlers
  const handleAddScheduleClick = (staffId: string, date: Date) => {
    setSelectedCell({ staffId, date });
    setAddSheetOpen(true);
  };

  const handleSelectShift = (shift: Shift) => {
    if (selectedCell) {
      addSchedule(selectedCell.staffId, selectedCell.date, shift);
    }
  };

  const handleScheduleClick = (schedule: ScheduleWithShift) => {
    setSelectedSchedule(schedule);
    setDetailSheetOpen(true);
  };

  const handleCellSelect = (staffId: string, dateStr: string) => {
    if (selectionMode) {
      toggleSlot(staffId, dateStr);
    }
  };

  const handleDayClick = (date: Date) => {
    // Switch to week view and go to that date
    changeView("week");
    goToDate(date);
  };

  // Batch handlers
  const handleBatchApplyShift = (shift: Shift) => {
    batchAddSchedules(selectedSlots, shift);
    clearSelection();
  };

  const handleBatchPublish = () => {
    // Get all schedule IDs for selected slots
    const scheduleIds: string[] = [];
    selectedSlots.forEach(({ staffId, dateStr }) => {
      const cellSchedules = getSchedulesForCell(staffId, dateStr);
      cellSchedules.forEach((s) => {
        if (s.status === "DRAFT") {
          scheduleIds.push(s.id);
        }
      });
    });

    if (scheduleIds.length > 0) {
      batchPublishSchedules(scheduleIds);
    } else {
      toast.info("Không có lịch nháp nào để công bố");
    }
    clearSelection();
  };

  const handleBatchDelete = () => {
    // Get all schedule IDs for selected slots
    const scheduleIds: string[] = [];
    selectedSlots.forEach(({ staffId, dateStr }) => {
      const cellSchedules = getSchedulesForCell(staffId, dateStr);
      cellSchedules.forEach((s) => scheduleIds.push(s.id));
    });

    if (scheduleIds.length > 0) {
      batchRemoveSchedules(scheduleIds);
    } else {
      toast.info("Không có lịch nào để xóa");
    }
    clearSelection();
  };

  const handlePublishAll = () => {
    const draftIds = draftSchedules.map((s) => s.id);
    if (draftIds.length > 0) {
      batchPublishSchedules(draftIds);
    }
  };

  // Get staff name for sheet
  const selectedStaffName = selectedCell
    ? staffList.find((s) => s.user_id === selectedCell.staffId)?.user.full_name ?? undefined
    : undefined;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 flex-wrap">
          <ViewSwitcher value={view} onChange={changeView} />
          <DateNavigator
            date={currentDate}
            formattedDateRange={formattedDateRange}
            isToday={isToday}
            onPrev={goToPrev}
            onNext={goToNext}
            onToday={goToToday}
            onDateSelect={goToDate}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StaffFilter
            staffList={staffList}
            selectedStaffIds={filters.staffIds}
            selectedRoles={filters.roles}
            onStaffChange={setStaffFilter}
            onRoleChange={setRoleFilter}
            onClear={clearFilters}
          />

          {/* Selection mode toggle */}
          <Button
            variant={selectionMode ? "secondary" : "outline"}
            size="sm"
            className={cn("h-8 px-3 gap-2", selectionMode && "bg-primary/10 text-primary")}
            onClick={toggleSelectionMode}
          >
            <MousePointer2 className="size-4" />
            <span className="hidden sm:inline">Chọn nhiều</span>
          </Button>

          <ActionBar
            draftCount={draftSchedules.length}
            onManageShifts={() => setShiftManagerOpen(true)}
            onPublishAll={handlePublishAll}
          />
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 overflow-auto">
        {view === "week" ? (
          <WeekView
            staffList={filteredStaff}
            schedules={schedules}
            weekDays={weekDays}
            selectedSlots={selectedSlots}
            selectionMode={selectionMode}
            onAddSchedule={handleAddScheduleClick}
            onScheduleClick={handleScheduleClick}
            onCellSelect={handleCellSelect}
          />
        ) : (
          <MonthView
            dateRange={dateRange}
            currentMonth={currentDate}
            schedules={schedules}
            onDayClick={handleDayClick}
            onScheduleClick={handleScheduleClick}
          />
        )}
      </div>

      {/* Legend */}
      <div className="hidden lg:flex items-center justify-center py-2 border-t bg-muted/20">
        <ShiftLegend />
      </div>

      {/* Selection Toolbar (floating) */}
      {selectionMode && (
        <SelectionToolbar
          selectedCount={selectedCount}
          onApplyShift={handleBatchApplyShift}
          onPublishAll={handleBatchPublish}
          onDeleteAll={handleBatchDelete}
          onCancel={disableSelectionMode}
        />
      )}

      {/* Sheets */}
      <AddScheduleSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        staffName={selectedStaffName}
        date={selectedCell?.date}
        onSelectShift={handleSelectShift}
      />

      <ScheduleDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        schedule={selectedSchedule}
        onDelete={removeSchedule}
        onPublish={publishSchedule}
      />

      <ShiftManagerSheet open={shiftManagerOpen} onOpenChange={setShiftManagerOpen} />
    </div>
  );
}
