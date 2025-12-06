import { PartyPopper, Wrench, Settings2 } from "lucide-react";
import { ExceptionDate } from "../model/types";

export type EventStatus = 'holiday' | 'maintenance' | 'custom' | 'open';

export const EVENT_TYPES = [
    { 
        id: 'holiday', 
        label: 'Nghỉ lễ', 
        icon: PartyPopper, 
        color: 'text-destructive', 
        bg: 'bg-destructive/10', 
        border: 'border-destructive/20' 
    },
    { 
        id: 'maintenance', 
        label: 'Bảo trì', 
        icon: Wrench, 
        color: 'text-amber-600', 
        bg: 'bg-amber-500/10', 
        border: 'border-amber-500/20' 
    },
    { 
        id: 'custom', 
        label: 'Tùy chỉnh', 
        icon: Settings2, 
        color: 'text-primary', 
        bg: 'bg-primary/10', 
        border: 'border-primary/20' 
    }
] as const;

export const getStatusColor = (type: string, isClosed: boolean) => {
  if (type === 'holiday') return "destructive"; // Luôn đỏ
  if (type === 'maintenance') return "amber-500"; // Luôn cam
  if (isClosed) return "destructive"; // Đóng cửa thường cũng đỏ (hoặc xám đậm nếu muốn)
  return "primary"; // Xanh/Màu chủ đạo (Mở cửa đặc biệt)
};

export const getStatusStyles = (type: string, isClosed: boolean) => {
  // 1. Determine Background based on Type
  let bgClass = "bg-muted/30"; // Default
  if (type === 'holiday') bgClass = "bg-red-100 dark:bg-red-900/30";
  else if (type === 'maintenance') bgClass = "bg-amber-100 dark:bg-amber-900/30";
  else if (type === 'custom') bgClass = "bg-blue-100 dark:bg-blue-900/30";

  // 2. Determine Border & Text based on Status
  let borderClass = "";
  let textClass = "";

  if (isClosed) {
      // Closed: Red Border & Text
      borderClass = "border border-rose-500/50";
      textClass = "text-rose-700 dark:text-rose-400";
  } else {
      // Open: Green Border & Text
      borderClass = "border border-emerald-500/50";
      textClass = "text-emerald-700 dark:text-emerald-400";
  }

  // Hover Effect Base
  const hoverClass = "hover:shadow-sm hover:ring-1 hover:ring-ring/50";

  return {
    badge: `${bgClass} ${textClass} ${borderClass}`,
    calendarItem: `${bgClass} ${textClass} ${borderClass} font-semibold ${hoverClass}`,
    border: borderClass,
    text: textClass,
    bg: bgClass
  };
};

export const getCalendarModifiers = (exceptions: ExceptionDate[]) => {
    return {
        holiday: exceptions.filter(e => e.type === 'holiday' || (e.isClosed && e.type === 'custom')).map(e => e.date),
        maintenance: exceptions.filter(e => e.type === 'maintenance').map(e => e.date),
        special: exceptions.filter(e => !e.isClosed && e.type === 'custom').map(e => e.date),
    };
};

export const getCalendarModifierClassNames = () => {
    const holidayStyle = getStatusStyles('holiday', true);
    const maintenanceStyle = getStatusStyles('maintenance', true);
    const specialStyle = getStatusStyles('custom', false);

    return {
        holiday: `${holidayStyle.calendarItem} line-through decoration-destructive/50 decoration-2`,
        maintenance: maintenanceStyle.calendarItem,
        special: `${specialStyle.calendarItem} ring-1 ring-primary`,
    };
};
