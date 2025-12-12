"use client";

/**
 * AppointmentsPage - Trang chính Quản lý Lịch hẹn
 *
 * Container component cho toàn bộ giao diện lịch hẹn.
 * Bao gồm: Dashboard Metrics, Toolbar, Calendar Views.
 */

import { Filter, Plus, RefreshCw, Settings2 } from "lucide-react";
import { use, useCallback, useEffect, useState, useTransition } from "react"; // Added `useCallback` hook

import { PageContent, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/shared/ui";
import { showToast } from "@/shared/ui/custom/sonner";

import { createInvoice, getInvoice } from "@/features/billing/actions";
import { getBookingReview } from "@/features/reviews/actions"; // Import getBookingReview
import { ReviewPrompt } from "@/features/reviews/components/review-prompt"; // Import ReviewPrompt
import { ActionResponse } from "@/shared/lib/action-response"; // Import ActionResponse
import {
  cancelAppointment,
  checkInAppointment,
  deleteAppointment,
  getAppointmentMetrics,
  getAppointments,
  markNoShow
} from "../actions"; // getStaffList, getResourceList, getServiceList are now passed as props
import { useCalendarState } from "../hooks/use-calendar-state";
import { MockService } from "../mock-data"; // Import MockService, MOCK_STAFF
import type { Appointment, AppointmentMetrics, CalendarEvent, TimelineResource } from "../types";
import { CalendarView } from "./calendar";
import { AppointmentSheet } from "./sheet";
import { DateNavigator, ViewSwitcher } from "./toolbar";
import { WalkInBookingDialog } from "./walk-in-booking-dialog";

// ============================================
// COMPONENT
// ============================================

interface AppointmentsPageProps {
  appointmentsPromise: Promise<ActionResponse<CalendarEvent[]>>;
  staffListPromise: Promise<ActionResponse<TimelineResource[]>>;
  resourceListPromise: Promise<ActionResponse<TimelineResource[]>>;
  serviceListPromise: Promise<ActionResponse<MockService[]>>;
  fullStaffList: TimelineResource[]; // Passed directly from Server Component
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

  // Filters state - TODO: implement proper filter hook
  const currentFilters: { staffIds?: string[]; resourceIds?: string[]; statusFilter?: string[] } = {};

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
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null); // State to manage review prompt


  // Fetch metrics when date changes (metrics are dynamic and client-side controlled)
  useEffect(() => {
    startTransition(async () => {
      const metricsResult = await getAppointmentMetrics(date);
      if (metricsResult.status === "success" && metricsResult.data) {
        setMetrics(metricsResult.data);
      }
    });
  }, [date]);


  const refreshEvents = useCallback(async () => {
    const result = await getAppointments(dateRange, currentFilters);
    if (result.status === "success" && result.data) {
        setEvents(result.data);
    }
  }, [dateRange, currentFilters]);

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

  const handleReviewNeeded = useCallback(async (bookingId: string) => {
    const booking = events.find(e => e.id === bookingId)?.appointment;

    if (!booking || booking.status !== "completed") return;

    // 1. Check if invoice exists and is paid
    const invoiceRes = await getInvoice(bookingId); // assuming bookingId can be used to find invoice
    if (invoiceRes.status !== "success" || !invoiceRes.data || invoiceRes.data.status !== "PAID") {
        return; // Invoice not paid, or not found. Don't prompt for review.
    }

    // 2. Check if review already exists
    const reviewRes = await getBookingReview(bookingId);
    if (reviewRes.status === "success" && reviewRes.data) {
        return; // Review already exists for this booking. Don't prompt.
    }

    // If all conditions met, show review prompt
    setSelectedBookingForReview(bookingId);
  }, [events, getInvoice, getBookingReview]); // Added getInvoice, getBookingReview as dependencies

  const handleSaveAppointment = (appointment: Appointment) => {
    // TODO: Call API to save appointment (this will be implemented in M3.2)
    console.log("Saving appointment:", appointment);
    setIsSheetOpen(false);
    handleRefresh();
    // After saving, if status is completed, check for review prompt
    if (appointment.status === "completed") {
        handleReviewNeeded(appointment.id);
    }
  };

  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      const result = await getAppointments(dateRange, currentFilters);
      if (result.status === "success" && result.data) {
          setEvents(result.data);
      }
      const metricsResult = await getAppointmentMetrics(date);
      if (metricsResult.status === "success" && metricsResult.data) {
        setMetrics(metricsResult.data);
      }
    });
  }, [dateRange, currentFilters, date]);

  // Actions Handlers
  const handleCheckIn = useCallback(
    async (event: CalendarEvent) => {
      if (!event.id) return;
      startTransition(async () => {
        const result = await checkInAppointment(event.id!);
        if (result.status === "success") {
          showToast.success(result.message || "Check-in thành công");
          handleRefresh();
        } else {
          showToast.error(result.message || "Không thể check-in");
        }
      });
    },
    [handleRefresh]
  );

  const handleNoShow = useCallback(
    async (event: CalendarEvent) => {
      if (!event.id) return;
      startTransition(async () => {
        const result = await markNoShow(event.id!);
        if (result.status === "success") {
          showToast.success(result.message || "Đã đánh dấu No-show");
          handleRefresh();
        } else {
          showToast.error(result.message || "Không thể đánh dấu No-show");
        }
      });
    },
    [handleRefresh]
  );

  const handleCancel = useCallback(
    async (event: CalendarEvent) => {
      if (!event.id) return;
      const now = new Date();
      const hoursDifference = (event.start.getTime() - now.getTime()) / (1000 * 60 * 60);

      let message = "Bạn có chắc chắn muốn hủy lịch hẹn này?";
      if (hoursDifference < 2 && hoursDifference > 0) {
        message = "Cảnh báo: Hủy lịch hẹn trước 2 giờ có thể bị tính phí hoặc vi phạm chính sách. Bạn có chắc chắn muốn hủy?";
      }

      if (!confirm(message)) return;

      startTransition(async () => {
        const result = await cancelAppointment(event.id!);
        if (result.status === "success") {
          showToast.success(result.message || "Hủy lịch hẹn thành công");
          handleRefresh();
        } else {
          showToast.error(result.message || "Không thể hủy lịch hẹn");
        }
      });
    },
    [handleRefresh]
  );

  const handleDelete = useCallback(
    async (event: CalendarEvent) => {
      if (!event.id) return;
      if (!confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
      startTransition(async () => {
        const result = await deleteAppointment(event.id!);
        if (result.status === "success") {
          showToast.success(result.message || "Xóa lịch hẹn thành công");
          handleRefresh();
        } else {
          showToast.error(result.message || "Không thể xóa lịch hẹn");
        }
      });
    },
    [handleRefresh]
  );

  const handleEdit = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const handleCreateInvoice = useCallback(
    async (bookingId: string) => {
      startTransition(async () => {
        const result = await createInvoice(bookingId);
        if (result.status === "success") {
          showToast.success(result.message || "Tạo hóa đơn thành công");
          // Optional: Redirect to billing page or show invoice details
          // router.push(`/admin/billing?invoiceId=${result.data.id}`);
          setIsSheetOpen(false);
          // After invoice creation, if booking is completed and paid, prompt for review
          handleReviewNeeded(bookingId);
        } else {
          showToast.error(result.message || "Không thể tạo hóa đơn");
        }
      });
    },
    [handleReviewNeeded]
  );

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
      isRecurring: false,
      appointment: {
        id: "new",
        customerId: "",
        customerName: "",
        customerPhone: "",
        // NEW FIELDS
        items: [],
        totalPrice: 0,
        totalDuration: 60,

        // LEGACY FIELDS
        staffId: currentFilters.staffIds?.[0] || staffList[0]?.id || "",
        staffName: "",
        serviceId: "",
        serviceName: "",
        serviceColor: "#gray",

        startTime,
        endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
        duration: 60,
        status: "pending",
        isRecurring: false,
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
    <PageShell>
      {/* ============================================ */}
      {/* COMPACT HEADER */}
      {/* ============================================ */}
      <PageHeader className="py-3 shadow-none border-b">
         <div className="flex flex-1 items-center justify-between">
            {/* Header / Metrics Info */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold tracking-tight">Lịch hẹn</h1>

                {/* Metrics */}
                <div className="hidden lg:flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Hôm nay:</span>
                        <span className="font-semibold">{metrics?.todayTotal ?? 0}</span>
                    </div>

                    {(metrics?.todayPending ?? 0) > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                             <span className="font-semibold">{metrics?.todayPending}</span>
                             <span>chờ duyệt</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                         <span>Công suất:</span>
                         <span className="font-semibold text-foreground">{metrics?.occupancyRate ?? 0}%</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
               <Button variant="outline" size="sm" onClick={() => setShowWalkInDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo nhanh
               </Button>
               <Button size="sm" onClick={handleCreateClick}>
                  <Plus className="h-4 w-4 mr-2" />
                  Đặt lịch
               </Button>
            </div>
         </div>
      </PageHeader>

      <PageContent fullWidth className="p-0 gap-0">
        {/* ============================================ */}
        {/* TOOLBAR */}
        {/* ============================================ */}
        <div className="flex-none px-4 py-2 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <DateNavigator
                        date={date}
                        formattedDateRange={formattedDateRange}
                        isToday={isToday}
                        onPrev={goPrev}
                        onNext={goNext}
                        onToday={goToday}
                        onDateSelect={goToDate}
                    />
                </div>

                <div className="flex items-center gap-2">
                   <ViewSwitcher value={view} onChange={setView} hiddenViews={["timeline"]} className="mr-2" />

                   <div className="hidden sm:flex items-center gap-1 border-l pl-3">
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            <span className="sr-only">Bộ lọc</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bộ lọc</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isPending}
                            className="h-8 w-8 text-muted-foreground"
                            >
                            <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
                            <span className="sr-only">Làm mới</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Làm mới</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Settings2 className="h-4 w-4" />
                            <span className="sr-only">Cài đặt</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cài đặt hiển thị</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>

        {/* ============================================ */}
        {/* MAIN CALENDAR AREA */}
        {/* ============================================ */}
        <div className="flex-1 p-4 overflow-hidden h-full">
            <SurfaceCard className="h-full rounded-lg border overflow-hidden">
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
            </SurfaceCard>
        </div>
      </PageContent>

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
        onReviewNeeded={handleReviewNeeded}
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

      {/* ============================================ */}
      {/* REVIEW PROMPT FOR COMPLETED BOOKINGS */}
      {/* ============================================ */}
      {selectedEvent?.appointment && selectedBookingForReview === selectedEvent.appointment.id && (
        <ReviewPrompt
          bookingId={selectedBookingForReview}
          open={!!selectedBookingForReview}
          onOpenChange={(open) => {
            if (!open) setSelectedBookingForReview(null);
          }}
          onReviewSubmitted={() => {
            setSelectedBookingForReview(null);
            handleRefresh(); // Refresh appointments after review
          }}
          customerName={selectedEvent?.appointment?.customerName || ""}
          serviceName={selectedEvent?.appointment?.serviceName || ""}
        />
      )}
    </PageShell>
  );
}
