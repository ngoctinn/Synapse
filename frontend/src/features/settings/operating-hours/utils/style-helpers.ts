import { PartyPopper, Settings2, Wrench } from "lucide-react";
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
        color: 'text-alert-warning-foreground',
        bg: 'bg-alert-warning',
        border: 'border-alert-warning-border'
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
  let bgClass = "bg-muted/30"; // Default
  if (type === 'holiday') bgClass = "bg-destructive/10 dark:bg-destructive/20";
  else if (type === 'maintenance') bgClass = "bg-alert-warning dark:bg-alert-warning";
  else if (type === 'custom') bgClass = "bg-alert-info dark:bg-alert-info";


  let borderClass = "";
  let textClass = "";

  if (isClosed) {
      borderClass = "border border-destructive/50";
      textClass = "text-destructive dark:text-destructive";
  } else {
      borderClass = "border border-alert-success-border";
      textClass = "text-alert-success-foreground dark:text-alert-success-foreground";
  }

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
