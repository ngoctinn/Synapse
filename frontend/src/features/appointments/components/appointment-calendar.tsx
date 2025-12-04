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
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      <CalendarHeader
        date={date}
        onDateChange={setDate}
        view={view}
        onViewChange={setView}
      />

      {view === 'timeline' ? (
        <ResourceTimeline
          date={date}
          resources={MOCK_RESOURCES}
          appointments={MOCK_APPOINTMENTS}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Chế độ xem {view} đang được phát triển...
        </div>
      )}
    </div>
  );
}
