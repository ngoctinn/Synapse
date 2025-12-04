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
    <div className="flex flex-1 flex-col overflow-hidden bg-muted/30 h-full relative">
      {/* Container có thể cuộn */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-fit flex flex-col">

          {/* Hàng Header (Thời gian) */}
          <div
            className="sticky top-0 z-40 flex border-b border-border bg-card/80 backdrop-blur-sm shadow-sm"
            style={{ height: APPOINTMENT_SETTINGS.HEADER_HEIGHT }}
          >
            {/* Góc trên trái (Sticky Corner) */}
            <div
              className="sticky left-0 z-50 flex-shrink-0 border-r border-border bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
            >
              <span className="text-sm font-bold text-foreground font-serif">Nhân viên</span>
            </div>

            {/* Các khung giờ */}
            {timeSlots.map((slot, i) => (
              <div
                key={i}
                className="flex-shrink-0 border-r border-border px-2 py-3 text-xs font-medium text-muted-foreground flex items-center justify-center"
                style={{ width: APPOINTMENT_SETTINGS.CELL_WIDTH }}
              >
                {format(slot, 'HH:mm')}
              </div>
            ))}
          </div>

          {/* Body (Sidebar + Grid) */}
          <div className="flex relative">
            {/* Sidebar (Nhân viên) - Sticky Left */}
            <div
              className="sticky left-0 z-30 bg-card border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
            >
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 border-b border-border px-4 transition-colors hover:bg-muted/50 group bg-card"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT }}
                >
                  <Avatar className="h-10 w-10 border-2 border-card shadow-sm transition-transform group-hover:scale-105">
                    <AvatarImage src={resource.avatar} alt={resource.name} />
                    <AvatarFallback>{resource.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold text-foreground font-serif group-hover:text-primary transition-colors">
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
                  className="relative flex border-b border-border bg-card/30 hover:bg-card/80 transition-colors"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT, width: totalWidth }}
                >
                  {/* Đường kẻ dọc */}
                  {timeSlots.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-dashed border-border"
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
                  className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10 pointer-events-none"
                  style={{ left: currentTimePosition }}
                >
                  <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-red-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
