"use client";

/**
 * CalendarDndContext - Wrapper context cho drag and drop trên Calendar
 *
 * Sử dụng @dnd-kit với:
 * - Pointer sensor (8px activation)
 * - Keyboard sensor
 * - Collision detection
 * - Grid snapping modifier
 */

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  restrictToParentElement
} from "@dnd-kit/modifiers";
import { useCallback, useState } from "react";

import type { CalendarEvent, ZoomLevel } from "../../types";
import { EventCard } from "../event/event-card";


interface CalendarDndContextProps {
  children: React.ReactNode;
  /** Callback khi kéo thả hoàn tất */
  onEventMove?: (
    eventId: string,
    newStart: Date,
    newEnd: Date
  ) => Promise<void>;
  /** Callback khi đang kéo qua slot khác */
  onDragOver?: (eventId: string, targetDate: Date) => void;
  /** Zoom level để tính snapping */
  zoomLevel?: ZoomLevel;
  /** Có cho phép drag không */
  disabled?: boolean;
}

export interface DragData {
  type: "event";
  event: CalendarEvent;
}

export interface DropData {
  type: "slot";
  date: Date;
  hour: number;
  minute: number;
}

// CUSTOM MODIFIER: Grid Snapping

function createGridSnapModifier(zoomLevel: ZoomLevel): Modifier {
  const minuteHeight = 60 / zoomLevel; // pixels per minute based on zoom

  return ({ transform }) => {
    // Snap Y axis to grid
    const snappedY = Math.round(transform.y / minuteHeight) * minuteHeight;

    return {
      ...transform,
      y: snappedY,
    };
  };
}


export function CalendarDndContext({
  children,
  onEventMove,
  onDragOver,
  zoomLevel = 30,
  disabled = false,
}: CalendarDndContextProps) {
  // Active event being dragged
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px trước khi bắt đầu drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Modifiers
  const modifiers = [
    restrictToParentElement,
    createGridSnapModifier(zoomLevel),
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData;
    if (data?.type === "event") {
      setActiveEvent(data.event);
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!activeEvent || !onDragOver) return;

      const dropData = event.over?.data.current as DropData | undefined;
      if (dropData?.type === "slot") {
        const targetDate = new Date(dropData.date);
        targetDate.setHours(dropData.hour, dropData.minute, 0, 0);
        onDragOver(activeEvent.id, targetDate);
      }
    },
    [activeEvent, onDragOver]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveEvent(null);

      if (!over || !onEventMove) return;

      const dragData = active.data.current as DragData;
      const dropData = over.data.current as DropData;

      if (dragData?.type === "event" && dropData?.type === "slot") {
        const originalEvent = dragData.event;

        // Calculate new start time
        const newStart = new Date(dropData.date);
        newStart.setHours(dropData.hour, dropData.minute, 0, 0);

        // Calculate duration and new end time
        const durationMs =
          originalEvent.end.getTime() - originalEvent.start.getTime();
        const newEnd = new Date(newStart.getTime() + durationMs);

        // Only call if actually moved
        if (newStart.getTime() !== originalEvent.start.getTime()) {
          await onEventMove(originalEvent.id, newStart, newEnd);
        }
      }
    },
    [onEventMove]
  );

  const handleDragCancel = useCallback(() => {
    setActiveEvent(null);
  }, []);

  // ============================================
  // RENDER
  // ============================================

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}

      {/* Drag Overlay - hiển thị khi đang kéo */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeEvent && (
          <EventCard
            event={activeEvent}
            variant="compact"
            isOverlay
            className="w-[200px] shadow-2xl"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}


export { useDraggable, useDroppable } from "@dnd-kit/core";

