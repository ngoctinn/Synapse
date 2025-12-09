import { AppointmentPage, getAppointments, getResources } from '@/features/appointments';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản lý Lịch hẹn | Synapse CRM',
  description: 'Xem và quản lý lịch hẹn của Spa',
};

export default async function AppointmentsPage() {
  const [appointments, resources] = await Promise.all([
    getAppointments(),
    getResources()
  ]);

  return (
    <Suspense fallback={<div className="p-4 flex items-center justify-center min-h-screen text-muted-foreground">Đang tải lịch hẹn...</div>}>
      <AppointmentPage initialAppointments={appointments} initialResources={resources} />
    </Suspense>
  );
}
