"use client";

/**
 * AppointmentsPage - Trang chính Quản lý Lịch hẹn
 *
 * Container component cho toàn bộ giao diện lịch hẹn.
 * Bao gồm: Dashboard Metrics, Toolbar, Calendar Views.
 */

import { Filter, Plus, RefreshCw, Settings2 } from "lucide-react";
import { useEffect, useState, useTransition, use } from "react"; // Added `use` hook

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/shared/ui";
import { showToast } from "@/shared/ui/custom/sonner";

import { ActionResponse } from "@/shared/lib/action-response"; // Import ActionResponse
import {
  cancelAppointment,
  checkInAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentMetrics,
  getAppointments,
  markNoShow,
} from "../actions"; // getStaffList, getResourceList, getServiceList are now passed as props
import { createInvoice } from "@/features/billing/actions";
import { MockService, MockStaff } from "../mock-data"; // Import MockService, MockStaff
import { useCalendarState } from "../hooks/use-calendar-state";
import type { Appointment, AppointmentMetrics, CalendarEvent, TimelineResource } from "../types";
import { CalendarView } from "./calendar";
import { WalkInBookingDialog } from "./walk-in-booking-dialog";
import { AppointmentSheet } from "./sheet";
import { DateNavigator, ViewSwitcher } from "./toolbar";

// ============================================
// COMPONENT
// ============================================

interface AppointmentsPageProps {
  appointmentsPromise: Promise<ActionResponse<CalendarEvent[]>>;
  staffListPromise: Promise<ActionResponse<TimelineResource[]>>;
  resourceListPromise: Promise<ActionResponse<TimelineResource[]>>;
  serviceListPromise: Promise<ActionResponse<MockService[]>>;
  fullStaffList: MockStaff[]; // Passed directly from Server Component
}

export function AppointmentsPage({
  appointmentsPromise,
  staffListPromise,
  resourceListPromise,
  serviceListPromise,
  fullStaffList, // Data that doesn't need to be unwrapped
}: AppointmentsPageProps) {
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

  // Use the `use` hook to unwrap the promises from Server Component
  const appointmentsRes = use(appointmentsPromise);
  const staffRes = use(staffListPromise);
  const resourceRes = use(resourceListPromise);
  const serviceRes = use(serviceListPromise);

  // Extract initial data
  const initialEvents = appointmentsRes.status === 'success' ? appointmentsRes.data || [] : [];
  const initialStaffList = staffRes.status === 'success' ? staffRes.data || [] : [];
  const initialRoomList = resourceRes.status === 'success' ? resourceRes.data || [] : [];
  const initialServiceList = serviceRes.status === 'success' ? serviceRes.data || [] : [];


  // Client states
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [metrics, setMetrics] = useState<AppointmentMetrics | null>(null);
  const [staffList, setStaffList] = useState<TimelineResource[]>(initialStaffList);
  const [roomList, setRoomList] = useState<TimelineResource[]>(initialRoomList);
  const [isPending, startTransition] = useTransition();

  // Dialog/Sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [showWalkInDialog, setShowWalkInDialog] = useState(false);

  // Fetch metrics when date changes (metrics are dynamic and client-side controlled)
  useEffect(() => {
    startTransition(async () => {
      const metricsResult = await getAppointmentMetrics(date);
      if (metricsResult.status === "success" && metricsResult.data) {
        setMetrics(metricsResult.data);
      }
    });
  }, [date]);

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
    // TODO: Call API to save appointment (this will be implemented in M3.2)
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
      // Also fetch metrics
      fetchMetrics();
    });
  };

  // Actions Handlers
  const handleCheckIn = (event: CalendarEvent) => {
    startTransition(async () => {
      const result = await checkInAppointment(event.id);
      if (result.status === "success") {
        showToast.success(result.message);
        handleRefresh();
      } else {
        showToast.error(result.message || "Không thể check-in");
      }
    });
  };

  const handleNoShow = (event: CalendarEvent) => {
    startTransition(async () => {
      const result = await markNoShow(event.id);
      if (result.status === "success") {
        showToast.success(result.message);
        handleRefresh();
      } else {
        showToast.error(result.message || "Không thể đánh dấu No-show");
      }
    });
  };

  const handleCancel = (event: CalendarEvent) => {
    const now = new Date();
    const hoursDifference = (event.start.getTime() - now.getTime()) / (1000 * 60 * 60);

    let message = "Bạn có chắc chắn muốn hủy lịch hẹn này?";
    if (hoursDifference < 2 && hoursDifference > 0) {
      message = "Cảnh báo: Hủy lịch hẹn trước 2 giờ có thể bị tính phí hoặc vi phạm chính sách. Bạn có chắc chắn muốn hủy?";
    }

    if (!confirm(message)) return;

    startTransition(async () => {
      const result = await cancelAppointment(event.id);
      if (result.status === "success") {
        showToast.success(result.message);
        handleRefresh();
      } else {
        showToast.error(result.message || "Không thể hủy lịch hẹn");
      }
    });
  };

  const handleDelete = (event: CalendarEvent) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    startTransition(async () => {
      const result = await deleteAppointment(event.id);
      if (result.status === "success") {
        showToast.success(result.message);
        handleRefresh();
      } else {
        showToast.error(result.message || "Không thể xóa lịch hẹn");
      }
    });
  };

  const handleEdit = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const handleCreateInvoice = (bookingId: string) => {
    startTransition(async () => {
      const result = await createInvoice(bookingId);
      if (result.status === "success") {
        showToast.success(result.message);
        // Optional: Redirect to billing page or show invoice details
        // router.push(`/admin/billing?invoiceId=${result.data.id}`);
        setIsSheetOpen(false);
      } else {
        showToast.error(result.message || "Không thể tạo hóa đơn");
      }
    });
  };

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    // Create new event at clicked time
    const startTime = new Date(date);
    startTime.setHours(hour, minute, 0, 0);

    // Mock event for creation
    const mockEvent: CalendarEvent = {
      id: "new",
      start: startTime,
      end: new Date(startTime.getTime() + 60 * 60 * 1000), // Default 1 hour
      title: "Lịch hẹn mới",
      staffId: currentFilters.staffIds?.[0] || staffList[0]?.id || "",
      staffName: "",
      color: "gray",
      status: "pending",
      appointment: {
        id: "new",
        customerId: "",
        customerName: "",
        customerPhone: "",
        staffId: "",
        staffName: "",
        serviceId: "",
        serviceName: "",
        startTime,
        endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
        duration: 60,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "",
      },
    };

    setSelectedEvent(mockEvent);
    setSheetMode("create");
    setIsSheetOpen(true);
  };

  // Error handling for initial data
  if (appointmentsRes.status === 'error') {
    return <div className="p-4 text-destructive">Lỗi tải lịch hẹn: {appointmentsRes.message}</div>;
  }
  if (staffRes.status === 'error') {
    return <div className="p-4 text-destructive">Lỗi tải danh sách nhân viên: {staffRes.message}</div>;
  }
  if (resourceRes.status === 'error') {
    return <div className="p-4 text-destructive">Lỗi tải danh sách tài nguyên: {resourceRes.message}</div>;
  }
  if (serviceRes.status === 'error') {
    return <div className="p-4 text-destructive">Lỗi tải danh sách dịch vụ: {serviceRes.message}</div>;
  }


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
          <div className="flex items-center gap-2">
            <Button
              className="gap-2 shadow-sm h-8"
              size="sm"
              onClick={() => setShowWalkInDialog(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tạo nhanh</span>
            </Button>
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
            onSlotClick={handleSlotClick}
            isLoading={isPending && events.length === 0}
            onCheckIn={handleCheckIn}
            onNoShow={handleNoShow}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onEdit={handleEdit}
            className="flex-1"
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
        onCreateInvoice={handleCreateInvoice}
        availableStaff={staffList}
        availableResources={roomList}
        availableServices={initialServiceList}
      />

      {/* ============================================ */}
      {/* WALK-IN BOOKING DIALOG */}
      {/* ============================================ */}
      <WalkInBookingDialog
        open={showWalkInDialog}
        onOpenChange={setShowWalkInDialog}
        availableStaff={staffList}
        availableResources={roomList}
        availableServices={initialServiceList}
        onBookingSuccess={handleRefresh}
      />
    </div>
  );
}