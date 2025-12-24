"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";

// ============================================================================
// CONSTANTS - Kích thước ô lịch cố định
// ============================================================================
const CELL_SIZE = "2rem"; // 32px - kích thước chuẩn cho mỗi ô ngày

// ============================================================================
// CALENDAR COMPONENT - Lịch chọn ngày với hỗ trợ single/range selection
// ============================================================================
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  // Tạo style object cho CSS variable
  const calendarStyle = { "--cell-size": CELL_SIZE } as React.CSSProperties;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Base styles
        "group/calendar bg-background p-3",
        // Transparent khi trong popover/card
        "[[data-slot=card-content]_&]:bg-transparent",
        "[[data-slot=popover-content]_&]:bg-transparent",
        className
      )}
      style={calendarStyle}
      captionLayout={captionLayout}
      formatters={{
        // Format tháng ngắn gọn cho dropdown (Tiếng Việt)
        formatMonthDropdown: (date) =>
          date.toLocaleString("vi-VN", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        // Container
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),

        // Navigation
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[var(--cell-size)] p-0 select-none",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[var(--cell-size)] p-0 select-none",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          defaultClassNames.button_next
        ),

        // Caption & Dropdowns
        month_caption: cn(
          "flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[var(--cell-size)] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md border border-input shadow-premium-sm",
          "has-[:focus]:border-ring has-[:focus]:ring-2 has-[:focus]:ring-ring/30",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),

        // Table layout
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[var(--cell-size)] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-[0.8rem] text-muted-foreground",
          defaultClassNames.week_number
        ),

        // Day cells
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          "[&:last-child[data-selected=true]_button]:rounded-r-md",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day
        ),

        // Range selection states
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),

        // Special states
        today: cn(
          "rounded-md bg-accent text-accent-foreground",
          "data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground/60 aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "pointer-events-none text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),

        ...classNames,
      }}
      components={{
        // Root wrapper với data-slot cho styling context
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        ),

        // Icons điều hướng với aria-label cho accessibility
        Chevron: ({ className, orientation, ...props }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
                ? ChevronRight
                : ChevronDown;

          return (
            <Icon
              className={cn("size-4", className)}
              aria-hidden="true"
              {...props}
            />
          );
        },

        DayButton: CalendarDayButton,

        // Week number cell
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),

        ...components,
      }}
      {...props}
    />
  );
}

// ============================================================================
// DAY BUTTON - Nút chọn ngày với các trạng thái selection
// ============================================================================
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  // Auto-focus khi ngày được focus (keyboard navigation)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // Xác định loại selection
  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString("vi-VN")}
      data-selected-single={isSelectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Base styles
        "flex aspect-square size-auto w-full min-w-[var(--cell-size)] flex-col gap-1",
        "font-normal leading-none",

        // Single selection
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",

        // Range selection
        "data-[range-start=true]:rounded-l-md data-[range-start=true]:rounded-r-none",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-middle=true]:rounded-none",
        "data-[range-end=true]:rounded-l-none data-[range-end=true]:rounded-r-md",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",

        // Focus states (keyboard navigation)
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-ring group-data-[focused=true]/day:ring-2",

        // Hover state
        "hover:bg-accent hover:text-accent-foreground",

        // Child span styling (for additional content)
        "[&>span]:text-xs [&>span]:opacity-70",

        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
