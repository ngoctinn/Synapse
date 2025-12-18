import type { CalendarEvent } from "../../types";
import { calculateEventPosition } from "./time-grid";

interface PositionedEvent {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  position: { top: number; height: number };
}

export function calculateEventLayout(
  events: CalendarEvent[],
  startHour: number,
  hourHeight: number
): PositionedEvent[] {
  if (events.length === 0) return [];

  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  const positioned: PositionedEvent[] = [];

  for (const event of sorted) {
    const position = calculateEventPosition(
      event.start,
      event.end,
      startHour,
      hourHeight
    );

    const overlapping = positioned.filter(
      (p) =>
        p.position.top < position.top + position.height &&
        p.position.top + p.position.height > position.top
    );

    if (overlapping.length === 0) {
      positioned.push({ event, column: 0, totalColumns: 1, position });
    } else {
      const usedColumns = new Set(overlapping.map((p) => p.column));
      let column = 0;
      while (usedColumns.has(column)) column++;

      const newTotalColumns = Math.max(
        column + 1,
        ...overlapping.map((p) => p.totalColumns)
      );

      for (const p of overlapping) {
        p.totalColumns = newTotalColumns;
      }

      positioned.push({
        event,
        column,
        totalColumns: newTotalColumns,
        position,
      });
    }
  }

  return positioned;
}
