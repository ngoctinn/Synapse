'use client';

import { useDraggableScroll } from '@/shared/hooks/use-draggable-scroll';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { format, isSameDay, setHours, setMinutes, startOfDay } from 'date-fns';
import * as React from 'react';
import { APPOINTMENT_SETTINGS } from '../constants';
import { Appointment, Resource } from '../types';
import { AppointmentCard } from './appointment-card';

interface ResourceTimelineProps {
  date: Date;
  resources: Resource[];
  appointments: Appointment[];
}

export function ResourceTimeline({ date, resources, appointments }: ResourceTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { events } = useDraggableScroll(containerRef);

  // Tạo các khung giờ (hours)
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let i = APPOINTMENT_SETTINGS.START_HOUR; i <= APPOINTMENT_SETTINGS.END_HOUR; i++) {
      slots.push(setMinutes(setHours(startOfDay(date), i), 0));
    }
    return slots;
  }, [date]);

  const totalWidth = timeSlots.length * APPOINTMENT_SETTINGS.CELL_WIDTH;

  // Tính toán vị trí hiện tại (Current Time Indicator)
  const [currentTimePosition, setCurrentTimePosition] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      if (now.getHours() < APPOINTMENT_SETTINGS.START_HOUR || now.getHours() > APPOINTMENT_SETTINGS.END_HOUR) {
        setCurrentTimePosition(null);
        return;
      }

      const start = now.getHours() + now.getMinutes() / 60;
      const position = (start - APPOINTMENT_SETTINGS.START_HOUR) * APPOINTMENT_SETTINGS.CELL_WIDTH;
      setCurrentTimePosition(position);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000); // Cập nhật mỗi phút
    return () => clearInterval(interval);
  }, []);

  // Helper tính toán vị trí appointment
  const getPosition = (startTime: Date, endTime: Date) => {
    const start = startTime.getHours() + startTime.getMinutes() / 60;
    const end = endTime.getHours() + endTime.getMinutes() / 60;

    const left = (start - APPOINTMENT_SETTINGS.START_HOUR) * APPOINTMENT_SETTINGS.CELL_WIDTH;
    const width = (end - start) * APPOINTMENT_SETTINGS.CELL_WIDTH;

    return { left, width };
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden select-none">
      {/* Container cuộn 2 chiều với Drag-to-Scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent outline-none cursor-grab touch-pan-y"
        {...events}
        role="grid"
        aria-label="Timeline lịch hẹn"
      >
        <div className="min-w-full w-fit flex flex-col">

          {/* Hàng Header (Thời gian) */}
          <div
            className="sticky right-0 left-0 z-30 flex border-b border-border bg-background/95 backdrop-blur-sm shadow-sm pointer-events-none row-header top-0"
            role="row"
            style={{
              height: APPOINTMENT_SETTINGS.HEADER_HEIGHT
            }}
          >
            {/* Góc trên trái (Sticky Corner) */}
            <div
              className="sticky left-0 z-50 flex-shrink-0 border-r border-border bg-background flex items-center justify-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
              role="columnheader"
              aria-label="Tên nhân viên"
            >
              <span className="text-sm font-bold text-foreground">Nhân viên</span>
            </div>

            {/* Các khung giờ */}
            {timeSlots.map((slot, i) => (
              <div
                key={i}
                className="flex-shrink-0 border-r border-border/50 px-2 py-3 text-xs font-medium text-muted-foreground flex items-center justify-center"
                style={{ width: APPOINTMENT_SETTINGS.CELL_WIDTH }}
                role="columnheader"
              >
                {format(slot, 'HH:mm')}
              </div>
            ))}
          </div>

          {/* Body (Sidebar + Grid) */}
          <div className="flex relative">
            {/* Sidebar (Nhân viên) - Sticky Left */}
            <div
              className="sticky left-0 z-20 bg-background border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] pointer-events-none"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
            >
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 border-b border-border/50 px-4 transition-colors hover:bg-muted/30 group bg-background"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT }}
                >
                  <Avatar className="h-11 w-11 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                    <AvatarImage src={resource.avatar} alt={resource.name} />
                    <AvatarFallback>{resource.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {resource.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {resource.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 min-w-0">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="relative flex border-b border-border/50 hover:bg-muted/20 transition-colors"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT, minWidth: totalWidth }}
                  role="row"
                >
                  {/* Đường kẻ dọc */}
                  {timeSlots.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-dashed border-border/40 pointer-events-none"
                      style={{ left: i * APPOINTMENT_SETTINGS.CELL_WIDTH, width: APPOINTMENT_SETTINGS.CELL_WIDTH }}
                    />
                  ))}

                  {/* Appointments */}
                  {appointments
                    .filter((apt) => apt.resourceId === resource.id && isSameDay(apt.startTime, date))
                    .map((apt) => {
                      const { left, width } = getPosition(apt.startTime, apt.endTime);
                      return (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          style={{
                            left: `${left}px`,
                            width: `${width}px`,
                            top: '4px',
                            bottom: '4px',
                          }}
                        />
                      );
                    })}
                </div>
              ))}

              {/* Chỉ báo thời gian hiện tại (Red Line) */}
              {currentTimePosition !== null && isSameDay(new Date(), date) && (
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-destructive z-10 pointer-events-none"
                  style={{ left: currentTimePosition }}
                >
                  <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-destructive" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
