'use client';

import { startOfToday } from 'date-fns';
import * as React from 'react';
import { Appointment, CalendarView, Resource } from '../types';
import { CalendarHeader } from './calendar-header';
import { ResourceTimeline } from './resource-timeline';

interface AppointmentTimelineProps {
  appointments: Appointment[];
  resources: Resource[];
  onSlotClick?: (resourceId: string, time: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function AppointmentTimeline({ appointments, resources, onSlotClick, onAppointmentClick }: AppointmentTimelineProps) {
  const [date, setDate] = React.useState<Date>(startOfToday());
  const [view, setView] = React.useState<CalendarView>('timeline');

  return (
    <div className="flex flex-col flex-1 w-full min-h-0 bg-background">
      <CalendarHeader
        date={date}
        onDateChange={setDate}
        view={view}
        onViewChange={setView}
      />

      {view === 'timeline' ? (
        <div className="flex-1 flex flex-col min-h-0 relative">
           <ResourceTimeline
            date={date}
            resources={resources}
            appointments={appointments}
            onSlotClick={onSlotClick}
            onAppointmentClick={onAppointmentClick}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Chế độ xem {view} đang được phát triển...
        </div>
      )}
    </div>
  );
}
