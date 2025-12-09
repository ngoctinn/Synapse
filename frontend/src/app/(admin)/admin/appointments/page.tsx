import { AppointmentPage, getAppointments, getCustomers, getResources } from '@/features/appointments';
import { getServices } from '@/features/services';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản lý Lịch hẹn | Synapse CRM',
  description: 'Xem và quản lý lịch hẹn của Spa',
};

export default async function AppointmentsPage() {
  const [appointments, resources, servicesResponse, customers] = await Promise.all([
    getAppointments(),
    getResources(),
    getServices(1, 100, undefined, true), // Get active services, up to 100
    getCustomers()
  ]);

  return (
    <Suspense fallback={<div className="p-4 flex items-center justify-center min-h-screen text-muted-foreground">Đang tải lịch hẹn...</div>}>
      <AppointmentPage
        initialAppointments={appointments}
        initialResources={resources}
        initialServices={servicesResponse.data}
        initialCustomers={customers}
      />
    </Suspense>
  );
}
