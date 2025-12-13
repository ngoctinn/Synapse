"use client";

import { createInvoice, getInvoice } from "@/features/billing/actions";
import { getBookingReview } from "@/features/reviews/actions";
import { ReviewPrompt } from "@/features/reviews/components/review-prompt";
import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { cn } from "@/shared/lib/utils";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { showToast } from "@/shared/ui/sonner";
import { Activity, CalendarCheck, Clock, LucideIcon, Plus, RefreshCw, Settings2 } from "lucide-react";
import { use, useCallback, useEffect, useState, useTransition } from "react";
import {
  checkInAppointment, deleteAppointment,
  getAppointmentMetrics, getAppointments, markNoShow
} from "../actions";
import { useCalendarState } from "../hooks/use-calendar-state";
import { MockService } from "../mock-data";
import type { Appointment, AppointmentFilters, AppointmentMetrics, CalendarEvent, TimelineResource } from "../types";
import { CalendarView } from "./calendar";
import { AppointmentSheet } from "./sheet";
import { CancelDialog } from "./sheet/cancel-dialog";
import { DateNavigator, ViewSwitcher } from "./toolbar";
import { AppointmentsFilter } from "./toolbar/appointments-filter";

function StatBadge({ icon: Icon, value, label, highlight = false, badge = false }: { icon: LucideIcon, value: number | string, label: string, highlight?: boolean, badge?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors cursor-help border",
          highlight
            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800"
            : "border-transparent hover:bg-muted/50 hover:border-border/50 text-muted-foreground"
        )}>
          <div className="relative">
            <Icon className="size-4" />
            {badge && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse border border-background" />}
          </div>
          <span className="font-semibold tabular-nums text-sm">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

interface AppointmentsPageProps {
  appointmentsPromise: Promise<ActionResponse<CalendarEvent[]>>;
  staffListPromise: Promise<ActionResponse<TimelineResource[]>>;
  resourceListPromise: Promise<ActionResponse<TimelineResource[]>>;
  serviceListPromise: Promise<ActionResponse<MockService[]>>;
  fullStaffList: TimelineResource[];
}

export function AppointmentsPage({ appointmentsPromise, staffListPromise, resourceListPromise, serviceListPromise }: AppointmentsPageProps) {
  const { view, setView, date, dateRange, formattedDateRange, isToday, goNext, goPrev, goToday, goToDate, densityMode } = useCalendarState();
  const [filters, setFilters] = useState<Partial<AppointmentFilters>>({});

  const appointmentsRes = use(appointmentsPromise);
  const staffRes = use(staffListPromise);
  const resourceRes = use(resourceListPromise);
  const serviceRes = use(serviceListPromise);

  const [events, setEvents] = useState<CalendarEvent[]>(appointmentsRes.status === 'success' ? appointmentsRes.data || [] : []);
  const [metrics, setMetrics] = useState<AppointmentMetrics | null>(null);
  const [staffList] = useState<TimelineResource[]>(staffRes.status === 'success' ? staffRes.data || [] : []);
  const [roomList] = useState<TimelineResource[]>(resourceRes.status === 'success' ? resourceRes.data || [] : []);
  const serviceList = serviceRes.status === 'success' ? serviceRes.data || [] : [];

  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create">("view");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null);

  // Dialog states
  const [actionEvent, setActionEvent] = useState<CalendarEvent | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getAppointmentMetrics(date);
      if (res.status === "success" && res.data) setMetrics(res.data);
    });
  }, [date]);

  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      const result = await getAppointments(dateRange, filters);
      if (result.status === "success" && result.data) setEvents(result.data);
      const mRes = await getAppointmentMetrics(date);
      if (mRes.status === "success" && mRes.data) setMetrics(mRes.data);
    });
  }, [dateRange, filters, date]);

  // Auto-refresh when filters or dateRange change
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event); setSheetMode("view"); setIsSheetOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null); setSheetMode("create"); setIsSheetOpen(true);
  };

  const handleReviewNeeded = useCallback(async (bookingId: string) => {
    const booking = events.find(e => e.id === bookingId)?.appointment;
    if (!booking || booking.status !== "COMPLETED") return;
    const invoiceRes = await getInvoice(bookingId);
    if (invoiceRes.status !== "success" || !invoiceRes.data || invoiceRes.data.status !== "PAID") return;
    const reviewRes = await getBookingReview(bookingId);
    if (!(reviewRes.status === "success" && reviewRes.data)) setSelectedBookingForReview(bookingId);
  }, [events]);

  const handleSaveAppointment = (appointment: Appointment) => {
    setIsSheetOpen(false); handleRefresh();
    if (appointment.status === "COMPLETED") handleReviewNeeded(appointment.id);
  };

  const wrapAction = useCallback((fn: (id: string) => Promise<ActionResponse<Appointment | undefined>>, successMsg: string, errorMsg: string) => {
    return async (event: CalendarEvent) => {
      if (!event.id) return;
      startTransition(async () => {
        const res = await fn(event.id!);
        if (res.status === "success") { showToast.success(res.message || successMsg); handleRefresh(); }
        else showToast.error(res.message || errorMsg);
      });
    };
  }, [handleRefresh]);

  // Dialog Handlers
  const handleCancelRequest = (event: CalendarEvent) => {
    setActionEvent(event);
    setIsCancelOpen(true);
  };

  const handleDeleteRequest = (event: CalendarEvent) => {
    setActionEvent(event);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!actionEvent?.id) return;
    startDeleteTransition(async () => {
      const res = await deleteAppointment(actionEvent.id!);
      if (res.status === "success") {
        showToast.success(res.message || "Xóa lịch hẹn thành công");
        handleRefresh();
        setIsDeleteOpen(false);
      } else {
        showToast.error(res.message || "Không thể xóa lịch hẹn");
      }
    });
  };

  const handleCreateInvoice = useCallback(async (bookingId: string) => {
    startTransition(async () => {
      const res = await createInvoice(bookingId);
      if (res.status === "success") { showToast.success(res.message || "Tạo hóa đơn thành công"); handleReviewNeeded(bookingId); }
      else showToast.error(res.message || "Không thể tạo hóa đơn");
    });
  }, [handleReviewNeeded]);

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const startTime = new Date(date); startTime.setHours(hour, minute, 0, 0);
    const endTime = new Date(startTime.getTime() + 36e5);
    const staffId = filters.staffIds?.[0] || staffList[0]?.id || "";
    setSelectedEvent({
      id: "new", start: startTime, end: endTime, title: "Lịch hẹn mới",
      staffId, staffName: "", color: "gray", status: "PENDING", isRecurring: false,
      appointment: {
        id: "new", customerId: "", customerName: "", customerPhone: "", items: [], totalPrice: 0, totalDuration: 60,
        staffId, staffName: "", serviceId: "", serviceName: "", serviceColor: "#gray",
        startTime, endTime, duration: 60, status: "PENDING", isRecurring: false,
        createdAt: new Date(), updatedAt: new Date(), createdBy: ""
      }
    });
    setSheetMode("create"); setIsSheetOpen(true);
  };

  if (appointmentsRes.status === 'error' || staffRes.status === 'error')
    return <div className="p-4 text-destructive">Lỗi tải dữ liệu</div>;

  const pending = metrics?.todayPending ?? 0;

  return (
    <PageShell>
      <PageHeader>
        <div className="flex items-center gap-4">
          <DateNavigator date={date} formattedDateRange={formattedDateRange} isToday={isToday} onPrev={goPrev} onNext={goNext} onToday={goToday} onDateSelect={goToDate} />
          <div className="hidden xl:flex items-center gap-2">
            <StatBadge icon={CalendarCheck} value={metrics?.todayTotal ?? 0} label="Tổng lịch hẹn hôm nay" />
            <StatBadge icon={Clock} value={pending} label="Lịch hẹn chờ duyệt" highlight={pending > 0} badge={pending > 0} />
            <StatBadge icon={Activity} value={`${metrics?.occupancyRate ?? 0}%`} label="Công suất phục vụ" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ViewSwitcher value={view} onChange={setView} />
          <div className="hidden sm:flex items-center gap-1 pl-1">
            <AppointmentsFilter staffList={staffList} filters={filters} onFilterChange={setFilters} />
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isPending} className="size-8 text-muted-foreground hover:text-foreground"><RefreshCw className={cn("size-4", isPending && "animate-spin")} /><span className="sr-only">Làm mới</span></Button></TooltipTrigger><TooltipContent>Làm mới</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground"><Settings2 className="size-4" /><span className="sr-only">Cài đặt</span></Button></TooltipTrigger><TooltipContent>Cài đặt hiển thị</TooltipContent></Tooltip>
          </div>
          <div className="pl-1">
            <Button size="sm" onClick={handleCreateClick} className="h-9 px-4 shadow-sm"><Plus className="size-4 sm:mr-2" /><span className="hidden sm:inline font-medium">Đặt lịch</span></Button>
          </div>
        </div>
      </PageHeader>
      <PageContent fullWidth className="p-0 gap-0">
        <div className="flex-1 p-4 overflow-hidden h-full">
            <SurfaceCard className="h-full rounded-lg border overflow-hidden">
            <CalendarView
                view={view} date={date} dateRange={dateRange} events={events} densityMode={densityMode}
                staffList={staffList} roomList={roomList} onEventClick={handleEventClick} onSlotClick={handleSlotClick}
                isLoading={isPending && events.length === 0} className="flex-1"
                onCheckIn={wrapAction(checkInAppointment, "Check-in thành công", "Không thể check-in")}
                onNoShow={wrapAction(markNoShow, "Đã đánh dấu No-show", "Không thể đánh dấu No-show")}
                onCancel={handleCancelRequest}
                onDelete={handleDeleteRequest}
                onEdit={(e) => { setSelectedEvent(e); setSheetMode("edit"); setIsSheetOpen(true); }}
            />
            </SurfaceCard>
        </div>
      </PageContent>
      <AppointmentSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} mode={sheetMode} event={selectedEvent} onSave={handleSaveAppointment} onCreateInvoice={handleCreateInvoice} onReviewNeeded={handleReviewNeeded} availableStaff={staffList} availableResources={roomList} availableServices={serviceList} />
      {selectedEvent?.appointment && selectedBookingForReview === selectedEvent.appointment.id && (
        <ReviewPrompt bookingId={selectedBookingForReview} open={!!selectedBookingForReview} onOpenChange={(open) => { if (!open) setSelectedBookingForReview(null); }} onReviewSubmitted={() => { setSelectedBookingForReview(null); handleRefresh(); }} customerName={selectedEvent?.appointment?.customerName || ""} serviceName={selectedEvent?.appointment?.serviceName || ""} />
      )}

      {/* Dialogs */}
      <CancelDialog
        event={actionEvent}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onSuccess={handleRefresh}
      />
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        entityName="lịch hẹn"
        entityLabel={actionEvent?.title}
      />
    </PageShell>
  );
}
