import { AppointmentPage } from '@/features/appointments/components/appointment-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Lịch hẹn | Synapse CRM',
  description: 'Xem và quản lý lịch hẹn của Spa',
};

export default function AppointmentsPage() {
  return <AppointmentPage />;
}
