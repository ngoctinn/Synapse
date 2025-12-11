"use client";

/**
 * AppointmentsPage - Trang chính Quản lý Lịch hẹn
 *
 * Container component cho toàn bộ giao diện lịch hẹn.
 * Bao gồm: Dashboard Metrics, Toolbar, Calendar Views.
 */

import { Filter, Plus, RefreshCw, Settings2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/shared/ui";

import { getAppointmentMetrics, getAppointments, getResourceList, getStaffList } from "../actions";
import { useCalendarState } from "../hooks/use-calendar-state";
import type { Appointment, AppointmentMetrics, CalendarEvent, TimelineResource } from "../types";
import { CalendarView } from "./calendar";
import { AppointmentSheet } from "./sheet";
import { DateNavigator, ViewSwitcher } from "./toolbar";

// ============================================
// COMPONENT
// ============================================

export function AppointmentsPage() {
  // Calendar state hook
  const {
    view,
    setView,
    date,
    dateRange,
    formattedDateRange,
    isToday,
    goNext,
    goPrev,
    goToday,
    goToDate,
    densityMode,
  } = useCalendarState();

  // Data state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [metrics, setMetrics] = useState<AppointmentMetrics | null>(null);
  const [staffList, setStaffList] = useState<TimelineResource[]>([]);
  const [roomList, setRoomList] = useState<TimelineResource[]>([]);
  const [isPending, startTransition] = useTransition();

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");

  // Fetch data when date range changes
  useEffect(() => {
    startTransition(async () => {
      const [eventsResult, metricsResult, staffResult, roomResult] = await Promise.all([
        getAppointments(dateRange),
        getAppointmentMetrics(date),
        getStaffList(),
        getResourceList(),
      ]);

      if (eventsResult.status === "success" && eventsResult.data) {
        setEvents(eventsResult.data);
      }

      if (metricsResult.status === "success" && metricsResult.data) {
        setMetrics(metricsResult.data);
      }

      if (staffResult.status === "success" && staffResult.data) {
        setStaffList(staffResult.data);
      }

      if (roomResult.status === "success" && roomResult.data) {
        setRoomList(roomResult.data);
      }
    });
  }, [dateRange, date]);

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setSheetMode("create");
    setIsSheetOpen(true);
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    // TODO: Call API to save appointment
    console.log("Saving appointment:", appointment);
    setIsSheetOpen(false);
    handleRefresh();
  };

  const handleRefresh = () => {
    startTransition(async () => {
      const result = await getAppointments(dateRange);
      if (result.status === "success" && result.data) {
        setEvents(result.data);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* ============================================ */}
      {/* COMPACT HEADER */}
      {/* ============================================ */}
      <div className="flex-none px-4 py-3 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Title + Inline Metrics */}
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold tracking-tight">
              Lịch hẹn
            </h1>

            {/* Inline Compact Metrics */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Hôm nay:</span>
                <span className="font-semibold tabular-nums">
                  {isPending && !metrics ? "—" : metrics?.todayTotal ?? 0}
                </span>
              </div>

              {(metrics?.todayPending ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-medium tabular-nums">{metrics?.todayPending}</span>
                  <span className="text-xs">chờ xác nhận</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>Lấp đầy:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {metrics?.occupancyRate ?? 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Button
            className="gap-2 shadow-sm h-8"
            size="sm"
            onClick={handleCreateClick}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tạo lịch hẹn</span>
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* TOOLBAR */}
      {/* ============================================ */}
      <div className="flex-none px-4 py-2 border-b">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Date Navigator */}
          <DateNavigator
            date={date}
            formattedDateRange={formattedDateRange}
            isToday={isToday}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
            onDateSelect={goToDate}
          />

          {/* View Switcher (Desktop) */}
          <div className="hidden md:block">
            <ViewSwitcher value={view} onChange={setView} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* View Switcher (Mobile) */}
            <div className="md:hidden">
              <ViewSwitcher value={view} onChange={setView} hiddenViews={["timeline"]} />
            </div>

            {/* Filter Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Bộ lọc</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bộ lọc</TooltipContent>
            </Tooltip>

            {/* Refresh Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isPending}
                >
                  <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
                  <span className="sr-only">Làm mới</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Làm mới</TooltipContent>
            </Tooltip>

            {/* Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Cài đặt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cài đặt hiển thị</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CALENDAR AREA */}
      {/* ============================================ */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="surface-card h-full rounded-lg border overflow-hidden">
          <CalendarView
            view={view}
            date={date}
            dateRange={dateRange}
            events={events}
            densityMode={densityMode}
            staffList={staffList}
            roomList={roomList}
            onEventClick={handleEventClick}
            isLoading={isPending && events.length === 0}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* APPOINTMENT SHEET */}
      {/* ============================================ */}
      <AppointmentSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        event={selectedEvent}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
