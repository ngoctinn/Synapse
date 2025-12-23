"use client";

/**
 * DraggableEventCard - Event card với tính năng drag
 *
 * Wrap EventCard với useDraggable từ @dnd-kit.
 */

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/shared/lib/utils";

import type { CalendarEvent } from "../../model/types";
import { EventCard } from "../event/event-card";
import type { DragData } from "./calendar-dnd-context";

interface DraggableEventCardProps {
  event: CalendarEvent;
  /** Variant hiển thị */
  variant?: "default" | "compact" | "mini";
  /** Có cho phép drag không */
  disabled?: boolean;
  /** Callback khi click (không phải drag) */
  onClick?: () => void;
  className?: string;
}

export function DraggableEventCard({
  event,
  variant = "compact",
  disabled = false,
  onClick,
  className,
}: DraggableEventCardProps) {
  const dragData: DragData = {
    type: "event",
    event,
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      data: dragData,
      disabled,
    });

  // Transform style khi drag
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none select-none",
        isDragging && "z-50 opacity-40",
        className
      )}
      {...listeners}
      {...attributes}
    >
      <EventCard
        event={event}
        variant={variant}
        isDragging={isDragging}
        onClick={disabled ? onClick : undefined}
      />
    </div>
  );
}
