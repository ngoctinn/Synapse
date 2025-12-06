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
  onSlotClick?: (resourceId: string, time: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function ResourceTimeline({ date, resources, appointments, onSlotClick, onAppointmentClick }: ResourceTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { events, isDragging } = useDraggableScroll(containerRef);
  const [hoverInfo, setHoverInfo] = React.useState<{ resourceId: string, time: string, left: number } | null>(null);

  // ... (lines 22-72)
  // Generate time slots (columns)
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let i = APPOINTMENT_SETTINGS.START_HOUR; i <= APPOINTMENT_SETTINGS.END_HOUR; i++) {
        // 2 slots per hour (30 mins) if needed, sticking to 1 hour based on settings usually
        // Assuming CELL_WIDTH corresponds to 1 hour for now based on previous code
      slots.push(setMinutes(setHours(startOfDay(date), i), 0));
    }
    return slots;
  }, [date]);

  const totalWidth = timeSlots.length * APPOINTMENT_SETTINGS.CELL_WIDTH;

  // Current Time Indicator Position
  const [currentTimePosition, setCurrentTimePosition] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      if (!isSameDay(now, date)) {
        setCurrentTimePosition(null);
        return;
      }

      const currentHour = now.getHours();
      if (currentHour < APPOINTMENT_SETTINGS.START_HOUR || currentHour > APPOINTMENT_SETTINGS.END_HOUR) {
        setCurrentTimePosition(null);
        return;
      }

      const start = currentHour + now.getMinutes() / 60;
      const position = (start - APPOINTMENT_SETTINGS.START_HOUR) * APPOINTMENT_SETTINGS.CELL_WIDTH;
      setCurrentTimePosition(position);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    return () => clearInterval(interval);
  }, [date]);

  // Appointment Positioning Helper
  const getPosition = (startTime: Date, endTime: Date) => {
    const start = startTime.getHours() + startTime.getMinutes() / 60;
    const end = endTime.getHours() + endTime.getMinutes() / 60;

    const left = (start - APPOINTMENT_SETTINGS.START_HOUR) * APPOINTMENT_SETTINGS.CELL_WIDTH;
    const width = (end - start) * APPOINTMENT_SETTINGS.CELL_WIDTH;

    return { left, width };
  };

  const handleCellClick = (resourceId: string, hour: number, minute: number = 0) => {
      if (isDragging.current) return;

      const clickTime = setMinutes(setHours(date, hour), minute);
      console.log(`Open booking for ${resourceId} at ${format(clickTime, 'HH:mm')}`);

      if (onSlotClick) {
          onSlotClick(resourceId, clickTime);
      }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, resourceId: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Calculate time from x
      const hoursFromStart = x / APPOINTMENT_SETTINGS.CELL_WIDTH;
      const totalMinutes = hoursFromStart * 60;

      // Round to nearest 15
      const roundedMinutes = Math.round(totalMinutes / 15) * 15;
      const hour = APPOINTMENT_SETTINGS.START_HOUR + Math.floor(roundedMinutes / 60);
      const minute = roundedMinutes % 60;

      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Snap highlight to grid
      const snapLeft = (roundedMinutes / 60) * APPOINTMENT_SETTINGS.CELL_WIDTH;

      setHoverInfo({
          resourceId,
          time: timeStr,
          left: snapLeft
      });
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden select-none bg-background">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent outline-none cursor-grab touch-pan-y"
        {...events}
        role="grid"
      >
        <div className="min-w-full w-fit flex flex-col">

          {/* Header Row (Time) */}
          <div
            className="sticky top-0 z-40 flex border-b border-border bg-background/95 backdrop-blur-sm shadow-sm"
            style={{ height: APPOINTMENT_SETTINGS.HEADER_HEIGHT }}
          >
            {/* Corner Cell (Sticky) */}
            <div
              className="sticky left-0 z-50 flex-shrink-0 border-r border-border bg-background flex items-center justify-center font-semibold text-sm shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
            >
              Nhân viên
            </div>

            {/* Time Columns */}
            {timeSlots.map((slot, i) => (
              <div
                key={i}
                className="flex-shrink-0 border-r border-border/40 text-xs font-medium text-muted-foreground flex items-center justify-center"
                style={{ width: APPOINTMENT_SETTINGS.CELL_WIDTH }}
              >
                {format(slot, 'HH:mm')}
              </div>
            ))}
          </div>

          {/* Body Rows */}
          <div className="flex relative">
            {/* Sidebar (Resources) - Sticky Left */}
            <div
              className="sticky left-0 z-30 bg-background border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
              style={{ width: APPOINTMENT_SETTINGS.SIDEBAR_WIDTH }}
            >
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 border-b border-border/50 px-4 group transition-colors hover:bg-muted/50"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT }}
                >
                  <Avatar className="h-9 w-9 border ring-1 ring-border/20">
                    <AvatarImage src={resource.avatar} alt={resource.name} />
                    <AvatarFallback className="text-xs">{resource.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {resource.name}
                    </span>
                    <span className="truncate text-[10px] uppercase text-muted-foreground">
                      {resource.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 min-w-0 bg-muted/5">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="relative flex border-b border-border/50 transition-colors bg-background"
                  style={{ height: APPOINTMENT_SETTINGS.CELL_HEIGHT, minWidth: totalWidth }}
                  onMouseMove={(e) => handleMouseMove(e, resource.id)}
                  onMouseLeave={() => setHoverInfo(null)}
                  onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const hoursFromStart = x / APPOINTMENT_SETTINGS.CELL_WIDTH;
                      const hour = APPOINTMENT_SETTINGS.START_HOUR + Math.floor(hoursFromStart);
                      const minutes = Math.floor((hoursFromStart % 1) * 60);
                      handleCellClick(resource.id, hour, minutes);
                  }}
                >
                  {/* Grid Lines */}
                  {timeSlots.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-dashed border-border/30 pointer-events-none"
                      style={{ left: i * APPOINTMENT_SETTINGS.CELL_WIDTH, width: APPOINTMENT_SETTINGS.CELL_WIDTH }}
                    />
                  ))}

                  {/* Hover Indicator */}
                  {hoverInfo && hoverInfo.resourceId === resource.id && (
                       <div
                         className="absolute top-0 bottom-0 bg-primary/5 pointer-events-none z-0 border-l border-primary/20 flex flex-col justify-end pb-1 pl-1"
                         style={{ left: hoverInfo.left, width: 2 }} // Thin line or width based on slot
                       >
                           <span className="text-[10px] bg-primary text-primary-foreground px-1 py-0.5 rounded leading-none w-fit whitespace-nowrap z-10">
                               {hoverInfo.time}
                           </span>
                       </div>
                  )}

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
                          // Prevent grid click propagation
                          onClick={(e) => {
                              // If e is available (it should be with MouseEventHandler), stop prop
                              e?.stopPropagation();
                              if (onAppointmentClick) {
                                  onAppointmentClick(apt);
                              }
                          }}
                        />
                      );
                    })}
                </div>
              ))}

              {/* Current Time Indicator (Global across all rows) */}
              {currentTimePosition !== null && (
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-red-500 z-20 pointer-events-none"
                  style={{ left: currentTimePosition }}
                >
                    <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
