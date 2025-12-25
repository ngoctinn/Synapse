"use client";

/**
 * ResourceTimeline - Timeline view theo nhân viên hoặc giường
 *
 * Hiển thị các events theo trục ngang, mỗi hàng là một resource.
 * Hỗ trợ horizontal scroll và zoom.
 */

import { isSameDay } from "date-fns";
import { DoorOpen, Users, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import { DEFAULT_WORKING_HOURS, ZOOM_LEVEL_OPTIONS } from "../../constants";
import type {
  CalendarEvent,
  ResourceType,
  TimelineResource,
  ZoomLevel,
} from "../../model/types";
import { TimelineHeader } from "./timeline-header";
import { TimelineRow } from "./timeline-row";

// TYPES

interface ResourceTimelineProps {
  /** Ngày đang xem */
  date: Date;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Danh sách nhân viên */
  staffList: TimelineResource[];
  /** Danh sách giường */
  bedList: TimelineResource[];
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

// COMPONENT

export function ResourceTimeline({
  date,
  events,
  staffList,
  bedList,
  onEventClick,
  className,
}: ResourceTimelineProps) {
  // State
  const [resourceType, setResourceType] = useState<ResourceType>("staff");
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(30);

  // Settings
  const slotWidth = zoomLevel === 15 ? 40 : zoomLevel === 30 ? 60 : 100;
  const { startHour, endHour } = DEFAULT_WORKING_HOURS;

  // Get active resources based on type
  const resources = useMemo(() => {
    const list = resourceType === "staff" ? staffList : bedList;
    return list.filter((r) => r.isActive);
  }, [resourceType, staffList, bedList]);

  // Filter events for today and group by resource
  const eventsByResource = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    // Initialize all resources
    for (const resource of resources) {
      map.set(resource.id, []);
    }

    // Group events
    for (const event of events) {
      if (!isSameDay(event.start, date)) continue;

      const resourceId =
        resourceType === "staff" ? event.staffId : event.resourceId;

      if (resourceId && map.has(resourceId)) {
        map.get(resourceId)!.push(event);
      }
    }

    return map;
  }, [events, resources, date, resourceType]);

  // Zoom handlers
  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVEL_OPTIONS.findIndex(
      (opt) => opt.value === zoomLevel
    );
    if (currentIndex > 0) {
      setZoomLevel(ZOOM_LEVEL_OPTIONS[currentIndex - 1].value);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVEL_OPTIONS.findIndex(
      (opt) => opt.value === zoomLevel
    );
    if (currentIndex < ZOOM_LEVEL_OPTIONS.length - 1) {
      setZoomLevel(ZOOM_LEVEL_OPTIONS[currentIndex + 1].value);
    }
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* ============================================ */}
      {/* TOOLBAR */}
      {/* ============================================ */}
      <div className="border-border/50 bg-muted/30 flex items-center justify-between gap-4 border-b p-3">
        {/* Resource Type Toggle */}
        <ToggleGroup
          type="single"
          value={resourceType}
          onValueChange={(val) => val && setResourceType(val as ResourceType)}
          className="bg-background rounded-lg p-0.5"
        >
          <ToggleGroupItem
            value="staff"
            size="sm"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1.5 px-3"
          >
            <Users className="size-4" />
            <span className="hidden sm:inline">Nhân viên</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bed"
            size="sm"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1.5 px-3"
          >
            <DoorOpen className="size-4" />
            <span className="hidden sm:inline">Giường</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-2 hidden text-xs sm:inline">
            Thu phóng:
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomIn}
                disabled={zoomLevel === 15}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Phóng to (chi tiết hơn)</TooltipContent>
          </Tooltip>

          <span className="bg-muted w-12 rounded px-2 py-1 text-center text-xs font-medium">
            {zoomLevel} phút
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
                disabled={zoomLevel === 60}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Thu nhỏ (tổng quan hơn)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* ============================================ */}
      {/* TIMELINE CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Header */}
          <TimelineHeader
            date={date}
            startHour={startHour}
            endHour={endHour}
            zoomLevel={zoomLevel}
            slotWidth={slotWidth}
          />

          {/* Rows */}
          {resources.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-2 text-center">
                <p className="text-muted-foreground text-sm">
                  {resourceType === "staff"
                    ? "Không có nhân viên nào đang làm việc"
                    : "Không có giường nào khả dụng"}
                </p>
              </div>
            </div>
          ) : (
            resources.map((resource) => (
              <TimelineRow
                key={resource.id}
                resource={resource}
                events={eventsByResource.get(resource.id) || []}
                zoomLevel={zoomLevel}
                slotWidth={slotWidth}
                startHour={startHour}
                endHour={endHour}
                onEventClick={onEventClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
