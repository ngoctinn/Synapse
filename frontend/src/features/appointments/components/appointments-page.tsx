"use client";

/**
 * AppointmentsPage - Trang chính Quản lý Lịch hẹn
 *
 * Container component cho toàn bộ giao diện lịch hẹn.
 * Bao gồm: Dashboard Metrics, Toolbar, Calendar Views.
 */

import { Activity, CalendarCheck, Clock, Filter, Plus, RefreshCw, Settings2 } from "lucide-react";
import { use, useCallback, useEffect, useState, useTransition } from "react";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/shared/ui";
import { showToast } from "@/shared/ui/sonner";

import { createInvoice, getInvoice } from "@/features/billing/actions";
import { getBookingReview } from "@/features/reviews/actions";
import { ReviewPrompt } from "@/features/reviews/components/review-prompt";
import { ActionResponse } from "@/shared/lib/action-response";
import {
  cancelAppointment,
  checkInAppointment,
  deleteAppointment,
  getAppointmentMetrics,
  getAppointments,
  markNoShow
} from "../actions";
import { useCalendarState } from "../hooks/use-calendar-state";
import { MockService } from "../mock-data";
import type { AppointmentMetrics, CalendarEvent, TimelineResource, Appointment } from "../types";
import { CalendarView } from "./calendar";
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
  fullStaffList: TimelineResource[];
}

export function AppointmentsPage({
  appointmentsPromise,
  staffListPromise,
  resourceListPromise,
  serviceListPromise,
  fullStaffList,
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

  // Filters state
  const currentFilters: { staffIds?: string[]; resourceIds?: string[]; statusFilter?: string[] } = {};

  // Unwrap promises
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
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null);

  // Fetch metrics
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

    const invoiceRes = await getInvoice(bookingId);
    if (invoiceRes.status !== "success" || !invoiceRes.data || invoiceRes.data.status !== "PAID") {
        return;
    }

    const reviewRes = await getBookingReview(bookingId);
    if (reviewRes.status === "success" && reviewRes.data) {
        return;
    }

    setSelectedBookingForReview(bookingId);
  }, [events]);

  const handleSaveAppointment = (appointment: Appointment) => {
    console.log("Saving appointment:", appointment);
    setIsSheetOpen(false);
    handleRefresh();
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
          handleReviewNeeded(bookingId);
        } else {
          showToast.error(result.message || "Không thể tạo hóa đơn");
        }
      });
    },
    [handleReviewNeeded]
  );

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const startTime = new Date(date);
    startTime.setHours(hour, minute, 0, 0);

    const mockEvent: CalendarEvent = {
      id: "new",
      start: startTime,
      end: new Date(startTime.getTime() + 60 * 60 * 1000),
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
        items: [],
        totalPrice: 0,
        totalDuration: 60,
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

  if (appointmentsRes.status === 'error') return <div className="p-4 text-destructive">Lỗi tải lịch hẹn: {appointmentsRes.message}</div>;
  if (staffRes.status === 'error') return <div className="p-4 text-destructive">Lỗi tải danh sách nhân viên: {staffRes.message}</div>;

  const pending = metrics?.todayPending ?? 0;

  return (
    <PageShell>
      <PageHeader>
        <div className="flex items-center gap-4">
          <DateNavigator
            date={date}
            formattedDateRange={formattedDateRange}
            isToday={isToday}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
            onDateSelect={goToDate}
          />

          <div className="hidden xl:flex items-center gap-2">
             <Tooltip>
               <TooltipTrigger asChild>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-help border border-transparent hover:border-border/50">
                    <CalendarCheck className="size-4 text-muted-foreground" />
                    <span className="font-semibold tabular-nums text-sm">{metrics?.todayTotal ?? 0}</span>
                 </div>
               </TooltipTrigger>
               <TooltipContent>Tổng lịch hẹn hôm nay</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors cursor-help border",
                    pending > 0
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800"
                      : "border-transparent hover:bg-muted/50 hover:border-border/50 text-muted-foreground"
                 )}>
                    <div className="relative">
                      <Clock className="size-4" />
                      {pending > 0 && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse border border-background" />}
                    </div>
                    <span className="font-semibold tabular-nums text-sm">{pending}</span>
                 </div>
               </TooltipTrigger>
               <TooltipContent>Lịch hẹn chờ duyệt</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-help border border-transparent hover:border-border/50">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="font-semibold tabular-nums text-sm">{metrics?.occupancyRate ?? 0}%</span>
                 </div>
               </TooltipTrigger>
               <TooltipContent>Công suất phục vụ</TooltipContent>
             </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ViewSwitcher value={view} onChange={setView} />

          <div className="hidden sm:flex items-center gap-1 pl-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Filter className="size-4" />
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
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
                  <span className="sr-only">Làm mới</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Làm mới</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Settings2 className="size-4" />
                  <span className="sr-only">Cài đặt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cài đặt hiển thị</TooltipContent>
            </Tooltip>
          </div>

          <div className="pl-1">
            <Button size="sm" onClick={handleCreateClick} className="h-9 px-4 shadow-sm">
              <Plus className="size-4 sm:mr-2" />
              <span className="hidden sm:inline font-medium">Đặt lịch</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent fullWidth className="p-0 gap-0">
        {/* ============================================ */}
        {/* TOOLBAR */}
        {/* ============================================ */}


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
