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
  const colorBase = getStatusColor(type, isClosed);
  
  // Xử lý custom classes cho từng màu để đảm bảo đúng chuẩn Tailwind
  let textClass = `text-${colorBase}`;
  let bgClass = `bg-${colorBase}/10`;
  let borderClass = `border-${colorBase}/20`;
  let hoverClass = `hover:bg-${colorBase}/20`;

  // Fix cụ thể cho màu primary/destructive/amber để tránh lỗi dynamic class string nếu tailwind không quét được
  if (colorBase === 'destructive') {
      textClass = "text-destructive";
      bgClass = "bg-destructive/10";
      borderClass = "border-destructive/20";
      hoverClass = "hover:bg-destructive/20";
  } else if (colorBase === 'amber-500') {
      textClass = "text-amber-600";
      bgClass = "bg-amber-500/10";
      borderClass = "border-amber-500/20";
      hoverClass = "hover:bg-amber-500/20";
  } else if (colorBase === 'primary') {
      textClass = "text-primary";
      bgClass = "bg-primary/10";
      borderClass = "border-primary/20";
      hoverClass = "hover:bg-primary/20";
  }

  return {
    badge: `${bgClass} ${textClass} ${borderClass}`,
    calendarItem: `${bgClass} ${textClass} font-bold ${hoverClass}`,
    border: borderClass,
    icon: textClass,
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
