"use client";

import { ReviewPrompt } from "@/features/reviews/components/review-prompt";
import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { ActionResponse } from "@/shared/lib/action-response";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  DeleteConfirmDialog,
  showToast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { Icon } from "@/shared/ui/custom/icon";
import {
  Activity,
  CalendarCheck,
  Clock,
  LucideIcon,
  Plus,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { use, useState } from "react";
import {
  useCalendarState,
  useAppointmentMetrics,
  useAppointmentEvents,
  useAppointmentDialogs,
  useAppointmentActions,
} from "../hooks";
import { MockService } from "../model/mocks";
import type {
  AppointmentFilters,
  CalendarEvent,
  TimelineResource,
} from "../model/types";
import { CalendarView } from "./calendar";
import { AppointmentSheet } from "./sheet";
import { CancelDialog } from "./sheet/cancel-dialog";
import { DateNavigator, ViewSwitcher } from "./toolbar";
import { AppointmentsFilter } from "./toolbar/appointments-filter";
function StatBadge({
  icon: InnerIcon,
  value,
  label,
  highlight = false,
  badge = false,
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
  highlight?: boolean;
  badge?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex cursor-default items-center gap-2 rounded-md border px-3 py-1.5 transition-all duration-300 hover:shadow-md",
            highlight
              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-500"
              : "text-muted-foreground hover:border-border/50 hover:bg-muted/50 border-transparent shadow-sm"
          )}
        >
          <div className="relative">
            <Icon icon={InnerIcon} className="size-4" />
            {badge && (
              <span className="border-background absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border bg-amber-500" />
            )}
          </div>
          <span className="text-sm font-semibold leading-relaxed tabular-nums">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="px-3 py-1.5 text-xs font-medium" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

interface AppointmentsPageProps {
  appointmentsPromise: Promise<ActionResponse<CalendarEvent[]>>;
  staffListPromise: Promise<ActionResponse<TimelineResource[]>>;
  resourceListPromise: Promise<ActionResponse<TimelineResource[]>>;
  serviceListPromise: Promise<ActionResponse<MockService[]>>;

  // Dependency Injection for cross-feature actions (FSD compliance)
  createInvoiceAction: (bookingId: string) => Promise<ActionResponse<unknown>>;
  getInvoiceAction: (bookingId: string) => Promise<ActionResponse<unknown>>;
  getBookingReviewAction: (bookingId: string) => Promise<ActionResponse<unknown>>;
}

export function AppointmentsPage({
  appointmentsPromise,
  staffListPromise,
  resourceListPromise,
  serviceListPromise,
  createInvoiceAction,
  getInvoiceAction,
  getBookingReviewAction,
}: AppointmentsPageProps) {
  const appointmentsRes = use(appointmentsPromise);
  const staffRes = use(staffListPromise);
  const resourceRes = use(resourceListPromise);
  const serviceRes = use(serviceListPromise);

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
  const [filters, setFilters] = useState<Partial<AppointmentFilters>>({});

  const staffList = staffRes.status === "success" ? staffRes.data || [] : [];
  const roomList = resourceRes.status === "success" ? resourceRes.data || [] : [];
  const serviceList = serviceRes.status === "success" ? serviceRes.data || [] : [];

  const { metrics, refreshMetrics, isPending: isMetricsPending } = useAppointmentMetrics(date);

  const { events, refreshEvents, isPending: isEventsPending, addOptimisticEvent } = useAppointmentEvents({
    dateRange,
    filters,
    initialEvents: appointmentsRes.status === "success" ? appointmentsRes.data || [] : [],
    onRefreshMetrics: refreshMetrics,
  });

  const {
    isSheetOpen, setIsSheetOpen,
    selectedEvent, setSelectedEvent,
    sheetMode, setSheetMode,
    selectedBookingForReview, setSelectedBookingForReview,
    actionEvent, isCancelOpen, setIsCancelOpen,
    isDeleteOpen, setIsDeleteOpen,
    handleEventClick, handleCreateClick, handleEditRequest,
    handleCancelRequest, handleDeleteRequest,
  } = useAppointmentDialogs();

  const {
    isPending: isActionPending,
    isDeleting,
    isCancelling,
    handleSaveAppointment,
    handleConfirmDelete,
    handleConfirmCancel,
    handleCreateInvoice,
    handleReviewNeeded,
    onCheckIn,
    onNoShow,
  } = useAppointmentActions({
    events,
    refreshEvents,
    setSelectedBookingForReview,
    setIsSheetOpen,
    setIsDeleteOpen,
    setIsCancelOpen,
    addOptimisticEvent,
    createInvoice: createInvoiceAction,
    getInvoice: getInvoiceAction,
    getBookingReview: getBookingReviewAction,
  });

  const isRefreshing = isMetricsPending || isEventsPending || isActionPending;

  const handlePaymentSuccess = () => {
    refreshEvents();
  };

  const handleSlotClick = (clickedDate: Date, hour: number, minute: number) => {
    const startTime = new Date(clickedDate);
    startTime.setHours(hour, minute, 0, 0);
    const endTime = new Date(startTime.getTime() + 36e5);
    const staffId = filters.staffIds?.[0] || staffList[0]?.id || "";

    setSelectedEvent({
      id: "new",
      start: startTime,
      end: endTime,
      title: "Lịch hẹn mới",
      staffId,
      staffName: "",
      color: "gray",
      status: "PENDING",
      isRecurring: false,
      appointment: {
        id: "new",
        customerId: "",
        customerName: "",
        customerPhone: "",
        items: [],
        totalPrice: 0,
        totalDuration: 60,
        staffId,
        staffName: "",
        serviceId: "",
        serviceName: "",
        serviceColor: "#gray",
        startTime,
        endTime,
        duration: 60,
        status: "PENDING",
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "",
      },
    });
    setSheetMode("create");
    setIsSheetOpen(true);
  };

  if (appointmentsRes.status === "error" || staffRes.status === "error")
    return <div className="text-destructive p-4">Lỗi tải dữ liệu</div>;

  const pendingCount = metrics?.todayPending ?? 0;

  return (
    <PageShell className="h-screen overflow-hidden">
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
          <div className="hidden items-center gap-2 xl:flex">
            <StatBadge
              icon={CalendarCheck}
              value={metrics?.todayTotal ?? 0}
              label="Tổng lịch hẹn hôm nay"
            />
            <StatBadge
              icon={Clock}
              value={pendingCount}
              label="Lịch hẹn chờ duyệt"
              highlight={pendingCount > 0}
              badge={pendingCount > 0}
            />
            <StatBadge
              icon={Activity}
              value={`${metrics?.occupancyRate ?? 0}%`}
              label="Công suất phục vụ"
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ViewSwitcher value={view} onChange={setView} />
          <div className="hidden items-center gap-1 pl-1 sm:flex">
            <AppointmentsFilter
              staffList={staffList}
              filters={filters}
              onFilterChange={setFilters}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refreshEvents}
                  disabled={isRefreshing}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon
                    icon={RefreshCw}
                    className={cn(isRefreshing && "animate-spin")}
                  />
                  <span className="sr-only">Làm mới</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Làm mới</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon icon={Settings2} />
                  <span className="sr-only">Cài đặt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cài đặt hiển thị</TooltipContent>
            </Tooltip>
          </div>
          <div className="pl-1">
            <Button
              onClick={handleCreateClick}
              className="shadow-sm"
            >
              <Icon icon={Plus} className="sm:mr-2" />
              <span className="hidden font-medium sm:inline">Đặt lịch</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent fullWidth className="flex flex-col gap-0 p-0">
        <div className="flex min-h-0 flex-1 flex-col p-0">
          <SurfaceCard className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
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
              isLoading={isEventsPending && events.length === 0}
              className="min-h-0 flex-1"
              onCheckIn={onCheckIn}
              onNoShow={onNoShow}
              onCancel={handleCancelRequest}
              onDelete={handleDeleteRequest}
              onEdit={handleEditRequest}
            />
          </SurfaceCard>
        </div>
      </PageContent>

      <AppointmentSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        event={selectedEvent}
        onSave={handleSaveAppointment}
        onCreateInvoice={handleCreateInvoice}
        onPaymentSuccess={handlePaymentSuccess}
        onReviewNeeded={handleReviewNeeded}
        availableStaff={staffList}
        availableResources={roomList}
        availableServices={serviceList}
      />

      {selectedEvent?.appointment &&
        selectedBookingForReview === selectedEvent.appointment.id && (
          <ReviewPrompt
            bookingId={selectedBookingForReview}
            open={!!selectedBookingForReview}
            onOpenChange={(open) => {
              if (!open) setSelectedBookingForReview(null);
            }}
            onReviewSubmitted={() => {
              setSelectedBookingForReview(null);
              refreshEvents();
            }}
            customerName={selectedEvent?.appointment?.customerName || ""}
            serviceName={selectedEvent?.appointment?.serviceName || ""}
          />
        )}

      {/* Dialogs */}
      <CancelDialog
        event={actionEvent}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onConfirm={handleConfirmCancel}
        isPending={isCancelling}
      />
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => handleConfirmDelete(actionEvent)}
        isDeleting={isDeleting}
        entityName="lịch hẹn"
        entityLabel={actionEvent?.title}
      />
    </PageShell>
  );
}
