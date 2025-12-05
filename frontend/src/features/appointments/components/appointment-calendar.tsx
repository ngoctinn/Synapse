'use client';

import { startOfToday } from 'date-fns';
import * as React from 'react';
import { MOCK_APPOINTMENTS, MOCK_RESOURCES } from '../mock-data';
import { CalendarView } from '../types';
import { CalendarHeader } from './calendar-header';
import { ResourceTimeline } from './resource-timeline';

export function AppointmentCalendar() {
  const [date, setDate] = React.useState<Date>(startOfToday());
  const [view, setView] = React.useState<CalendarView>('timeline');

  return (
    <div className="flex flex-col w-full h-[calc(100vh-60px)] bg-background">
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
            resources={MOCK_RESOURCES}
            appointments={MOCK_APPOINTMENTS}
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
