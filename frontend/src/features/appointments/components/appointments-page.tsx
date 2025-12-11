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
    Separator,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shared/ui";

import { getAppointmentMetrics, getAppointments } from "../actions";
import { useCalendarState } from "../hooks/use-calendar-state";
import type { AppointmentMetrics, CalendarEvent } from "../types";
import { CalendarView } from "./calendar";
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
  const [isPending, startTransition] = useTransition();

  // Fetch data when date range changes
  useEffect(() => {
    startTransition(async () => {
      const [eventsResult, metricsResult] = await Promise.all([
        getAppointments(dateRange),
        getAppointmentMetrics(date),
      ]);

      if (eventsResult.status === "success" && eventsResult.data) {
        setEvents(eventsResult.data);
      }

      if (metricsResult.status === "success" && metricsResult.data) {
        setMetrics(metricsResult.data);
      }
    });
  }, [dateRange, date]);

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    // TODO: Open appointment sheet
    console.log("Event clicked:", event);
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
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex-none p-4 pb-0 space-y-4">
        {/* Title & Actions */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Quản lý Lịch hẹn
            </h1>
            <p className="text-sm text-muted-foreground">
              Xem và quản lý tất cả các lịch hẹn của spa
            </p>
          </div>
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tạo lịch hẹn</span>
            <span className="sm:hidden">Tạo</span>
          </Button>
        </div>

        {/* ============================================ */}
        {/* METRICS CARDS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Hôm nay"
            value={metrics?.todayTotal ?? 0}
            subtitle="cuộc hẹn"
            isLoading={isPending && !metrics}
          />
          <MetricCard
            title="Chờ xác nhận"
            value={metrics?.todayPending ?? 0}
            subtitle="cuộc hẹn"
            highlight={metrics?.todayPending && metrics.todayPending > 0 ? "warning" : "default"}
            isLoading={isPending && !metrics}
          />
          <MetricCard
            title="Tỷ lệ lấp đầy"
            value={`${metrics?.occupancyRate ?? 0}%`}
            subtitle="hôm nay"
            isLoading={isPending && !metrics}
          />
          <MetricCard
            title="Doanh thu dự kiến"
            value={formatCurrencyShort(metrics?.estimatedRevenue ?? 0)}
            subtitle="VND"
            isLoading={isPending && !metrics}
          />
        </div>

        <Separator />

        {/* ============================================ */}
        {/* TOOLBAR */}
        {/* ============================================ */}
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
            onEventClick={handleEventClick}
            isLoading={isPending && events.length === 0}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: "default" | "warning" | "success" | "error";
  isLoading?: boolean;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  highlight = "default",
  isLoading = false,
}: MetricCardProps) {
  const highlightClasses = {
    default: "",
    warning: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
    success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
    error: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
  };

  if (isLoading) {
    return (
      <div className="surface-card p-4 rounded-lg border">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-12" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "surface-card p-3 sm:p-4 rounded-lg border transition-colors",
        highlightClasses[highlight]
      )}
    >
      <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-xl sm:text-2xl font-bold tracking-tight">{value}</span>
        <span className="text-xs sm:text-sm text-muted-foreground">{subtitle}</span>
      </div>
      {trend && (
        <p
          className={cn(
            "text-xs mt-1",
            trendUp ? "text-emerald-600" : "text-muted-foreground"
          )}
        >
          {trendUp && "↑ "}
          {trend}
        </p>
      )}
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toString();
}
