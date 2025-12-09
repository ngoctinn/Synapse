export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'serving'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Resource {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  color?: string;
}

export type CalendarView = 'timeline' | 'day' | 'week' | 'month';
