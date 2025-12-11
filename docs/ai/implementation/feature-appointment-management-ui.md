---
phase: implementation
title: Ghi chú Triển khai Giao diện Quản lý Lịch hẹn
description: Ghi chú kỹ thuật, code patterns, và tiến độ triển khai
feature: appointment-management-ui
status: in-progress
started: 2024-12-11
---

# Ghi chú Triển khai: Giao diện Quản lý Lịch hẹn

## 📁 Cấu trúc Module

### Cấu trúc Thư mục Hoàn chỉnh

```
features/appointments/
├── index.ts                    # Public API exports
├── types.ts                    # TypeScript interfaces
├── schemas.ts                  # Zod validation schemas
├── constants.ts                # Status colors, configs
├── mock-data.ts               # Dev mock data
├── actions.ts                  # Server Actions
│
├── hooks/
│   ├── index.ts
│   ├── use-calendar-state.ts
│   ├── use-appointments.ts
│   ├── use-calendar-dnd.ts
│   ├── use-conflict-detection.ts
│   └── use-recurrence.ts
│
├── components/
│   ├── index.ts
│   ├── appointments-page.tsx
│   │
│   ├── dashboard/
│   │   ├── index.ts
│   │   ├── metrics-cards.tsx
│   │   └── today-summary.tsx
│   │
│   ├── toolbar/
│   │   ├── index.ts
│   │   ├── view-switcher.tsx
│   │   ├── date-navigator.tsx
│   │   ├── filter-bar.tsx
│   │   └── zoom-control.tsx
│   │
│   ├── calendar/
│   │   ├── index.ts
│   │   ├── calendar-view.tsx
│   │   ├── day-view.tsx
│   │   ├── week-view.tsx
│   │   ├── month-view.tsx
│   │   ├── agenda-view.tsx
│   │   ├── time-grid.tsx
│   │   └── date-header.tsx
│   │
│   ├── timeline/
│   │   ├── index.ts
│   │   ├── resource-timeline.tsx
│   │   ├── timeline-header.tsx
│   │   ├── timeline-row.tsx
│   │   └── timeline-zoom.tsx
│   │
│   ├── event/
│   │   ├── index.ts
│   │   ├── event-card.tsx
│   │   ├── event-popover.tsx
│   │   ├── event-creation-overlay.tsx
│   │   └── resize-handles.tsx
│   │
│   ├── sheet/
│   │   ├── index.ts
│   │   ├── appointment-sheet.tsx
│   │   ├── appointment-form.tsx
│   │   ├── recurrence-builder.tsx
│   │   └── conflict-warning.tsx
│   │
│   └── dnd/
│       ├── index.ts
│       ├── calendar-dnd-context.tsx
│       ├── drag-overlay.tsx
│       └── drop-zone.tsx
│
└── lib/
    ├── date-utils.ts
    ├── rrule-utils.ts
    └── conflict-utils.ts
```

---

## 🎨 Code Patterns & Conventions

### 1. Component Pattern

```tsx
"use client"

import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Card, Button } from "@/shared/ui"
import type { CalendarEvent } from "../types"

interface EventCardProps {
  event: CalendarEvent
  isDragging?: boolean
  isOverlay?: boolean
  className?: string
  onClick?: () => void
}

export function EventCard({
  event,
  isDragging = false,
  isOverlay = false,
  className,
  onClick,
}: EventCardProps) {
  // Component logic here

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        isDragging && "opacity-50 scale-95",
        isOverlay && "shadow-lg scale-105",
        className
      )}
      style={{ backgroundColor: event.color }}
      onClick={onClick}
    >
      {/* Content */}
    </Card>
  )
}
```

### 2. Hook Pattern

```tsx
"use client"

import { useState, useCallback, useMemo } from "react"
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"
import type { CalendarViewType, CalendarViewConfig } from "../types"

export function useCalendarState(initialDate = new Date()) {
  const [view, setView] = useState<CalendarViewType>("week")
  const [date, setDate] = useState(initialDate)
  const [zoomLevel, setZoomLevel] = useState<15 | 30 | 60>(30)

  const dateRange = useMemo(() => {
    switch (view) {
      case "week":
        return { start: startOfWeek(date), end: endOfWeek(date) }
      // ... other cases
    }
  }, [view, date])

  const goNext = useCallback(() => {
    switch (view) {
      case "week":
        setDate(prev => addWeeks(prev, 1))
        break
      // ... other cases
    }
  }, [view])

  const goPrev = useCallback(() => {
    switch (view) {
      case "week":
        setDate(prev => subWeeks(prev, 1))
        break
    }
  }, [view])

  const goToday = useCallback(() => {
    setDate(new Date())
  }, [])

  return {
    view,
    setView,
    date,
    setDate,
    dateRange,
    zoomLevel,
    setZoomLevel,
    goNext,
    goPrev,
    goToday,
  }
}
```

### 3. Server Action Pattern

```tsx
"use server"

import { z } from "zod"
import { createClient } from "@/shared/lib/supabase/server"
import { appointmentFormSchema } from "./schemas"
import type { Appointment, AppointmentFilters } from "./types"
import { ActionResponse, createSuccessResponse, createErrorResponse } from "@/shared/lib/action-response"

interface GetAppointmentsParams {
  startDate: Date
  endDate: Date
  filters?: AppointmentFilters
}

export async function getAppointments(
  params: GetAppointmentsParams
): Promise<ActionResponse<Appointment[]>> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("appointments")
      .select("*")
      .gte("start_time", params.startDate.toISOString())
      .lte("end_time", params.endDate.toISOString())

    if (params.filters?.staffIds?.length) {
      query = query.in("staff_id", params.filters.staffIds)
    }

    const { data, error } = await query

    if (error) throw error

    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse("Không thể tải danh sách lịch hẹn")
  }
}

export async function createAppointment(
  formData: z.infer<typeof appointmentFormSchema>
): Promise<ActionResponse<Appointment>> {
  try {
    const supabase = await createClient()

    // Validate
    const validated = appointmentFormSchema.parse(formData)

    // Check conflicts
    const conflicts = await checkConflicts(
      validated.staffId,
      validated.startTime,
      validated.endTime
    )

    if (conflicts.length > 0) {
      return createErrorResponse("Xung đột lịch hẹn: " + conflicts[0].message)
    }

    // Insert
    const { data, error } = await supabase
      .from("appointments")
      .insert(validated)
      .select()
      .single()

    if (error) throw error

    return createSuccessResponse(data, "Tạo lịch hẹn thành công")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Dữ liệu không hợp lệ")
    }
    return createErrorResponse("Không thể tạo lịch hẹn")
  }
}
```

### 4. DnD Pattern với @dnd-kit

```tsx
"use client"

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToParentElement, snapCenterToCursor } from "@dnd-kit/modifiers"
import { useState, useCallback } from "react"
import type { CalendarEvent } from "../types"
import { EventCard } from "../event/event-card"

interface CalendarDnDContextProps {
  children: React.ReactNode
  onEventMove: (eventId: string, newStart: Date, newEnd: Date) => Promise<void>
}

export function CalendarDnDContext({ children, onEventMove }: CalendarDnDContextProps) {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px trước khi bắt đầu drag
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const eventData = event.active.data.current as CalendarEvent
    setActiveEvent(eventData)
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const draggedEvent = active.data.current as CalendarEvent
      const dropData = over.data.current as { date: Date; slot: number }

      // Tính toán thời gian mới
      const newStart = new Date(dropData.date)
      newStart.setMinutes(dropData.slot * 15)

      const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime()
      const newEnd = new Date(newStart.getTime() + duration)

      await onEventMove(draggedEvent.id, newStart, newEnd)
    }

    setActiveEvent(null)
  }, [onEventMove])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement, snapCenterToCursor]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay>
        {activeEvent && (
          <EventCard
            event={activeEvent}
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
```

---

## 📝 Tiến độ Triển khai

### Giai đoạn 1: Foundation ✅
| Task | Status | Notes |
|------|--------|-------|
| 1.1 Module structure & Types | ✅ Hoàn thành | `types.ts`, `constants.ts` |
| 1.2 Schemas & Validation | ✅ Hoàn thành | `schemas.ts` với Zod v4 |
| 1.3 Mock Data | ✅ Hoàn thành | 23 appointments, 5 staff, 8 services |
| 1.4 Server Actions | ✅ Hoàn thành | Mock CRUD + Conflict detection |
| 1.5 Basic Layout | ✅ Hoàn thành | ViewSwitcher, MetricCards placeholders |

### Giai đoạn 2: Calendar Views ✅
| Task | Status | Notes |
|------|--------|-------|
| 2.1 useCalendarState | ✅ Hoàn thành | State, dateRange, navigation |
| 2.2 Navigator & Switcher | ✅ Hoàn thành | DateNavigator, ViewSwitcher |
| 2.3 Time Grid | ✅ Hoàn thành | Time labels, current time indicator |
| 2.4 Day View | ✅ Hoàn thành | Single column, overlap handling |
| 2.5 Week View | ✅ Hoàn thành | 7 columns, responsive |
| 2.6 Month View | ✅ Hoàn thành | Grid, +X more popover |
| 2.7 Agenda View | ✅ Hoàn thành | List view, sticky headers |
| 2.8 View Router | ✅ Hoàn thành | CalendarView switch + EventCard |

### Giai đoạn 3: Timeline ✅
| Task | Status | Notes |
|------|--------|-------|
| 3.1 Timeline Layout | ✅ Hoàn thành | resource-timeline.tsx, timeline-header.tsx |
| 3.2 Timeline Row | ✅ Hoàn thành | timeline-row.tsx, avatar, events |
| 3.3 Zoom Control | ✅ Hoàn thành | Tích hợp trong ResourceTimeline |
| 3.4 Integration | ✅ Hoàn thành | CalendarView router, staffList/roomList |

### Giai đoạn 4: Drag & Drop ✅
| Task | Status | Notes |
|------|--------|-------|
| 4.1 DnD Context | ✅ Hoàn thành | CalendarDndContext + sensors |
| 4.2 Draggable Card | ✅ Hoàn thành | DraggableEventCard wrapper |
| 4.3 Drag Overlay | ✅ Hoàn thành | Tích hợp trong DndContext |
| 4.4 Drop Zones | ✅ Hoàn thành | DroppableSlot component |
| 4.5 useDnD Hook | ✅ Hoàn thành | useCalendarDnd + conflict check |
| 4.6 Resize | ⏳ P2 - Bỏ qua | Stretch goal |

### Giai đoạn 5: Forms & Sheets ✅
| Task | Status | Notes |
|------|--------|-------|
| 5.1 Event Popover | ✅ Hoàn thành | event-popover.tsx với quick actions |
| 5.2 Appointment Sheet | ✅ Hoàn thành | View/Edit/Create modes |
| 5.3 Appointment Form | ✅ Hoàn thành | Zod validation + customer search |
| 5.4 Recurrence Builder | ⏳ P2 - Bỏ qua | Stretch goal |
| 5.5 Conflict Hook | ✅ Hoàn thành | Tích hợp trong useCalendarDnd |
| 5.6 Conflict UI | ✅ Hoàn thành | ConflictWarning component |

### Giai đoạn 6: Polish ✅
| Task | Status | Notes |
|------|--------|-------|
| 6.1 Metrics Cards | ✅ Hoàn thành | Animated numbers, 4 cards |
| 6.2 Filter Bar | ✅ Hoàn thành | Multi-select, search, chips |
| 6.3 Empty States | ✅ Hoàn thành | 4 variants |
| 6.4 Mobile | ⏳ P2 - Bỏ qua | |
| 6.5 Keyboard | ⏳ P2 - Bỏ qua | |
| 6.6 Integration | ✅ Hoàn thành | Main exports updated |

---

## 🔧 Technical Decisions Log

### TD-001: Calendar Engine Choice
**Date**: 2024-12-11
**Decision**: Custom-built với @dnd-kit
**Rationale**:
- FullCalendar khó customize với oklch design system
- @dnd-kit đã có trong project, lightweight
- Need full control cho premium UX

### TD-002: State Management
**Date**: 2024-12-11
**Decision**: React useState + Context, không dùng Zustand/Redux
**Rationale**:
- Scope nhỏ, không cần global state
- Server Actions handle data mutations
- Simpler mental model

---

## 🐛 Known Issues

*(Sẽ được cập nhật trong quá trình triển khai)*

---

## 📚 Tham khảo

- [date-fns Documentation](https://date-fns.org/docs)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [iCalendar RRULE Spec](https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html)
