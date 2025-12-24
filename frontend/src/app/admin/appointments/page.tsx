import { AppointmentsPage } from "@/features/appointments/components/appointments-page";
import {
  getAppointments,
  getResourceList,
  getServiceList,
  getStaffList,
} from "@/features/appointments/actions";
import { MOCK_APPOINTMENTS } from "@/features/appointments";
import { endOfMonth, startOfMonth } from "date-fns";
import { Suspense } from "react";
import { createInvoice, getInvoice } from "@/features/billing/actions";
import { getBookingReview } from "@/features/reviews/actions";
import { AppointmentsPageSkeleton } from "@/features/appointments/components/appointments-page-skeleton";

/**
 * PAGE COMPONENT (Orchestrator)
 * ----------------------------
 * Tầng này chịu trách nhiệm quản lý sự phụ thuộc giữa các features.
 * Nó "tiêm" (inject) các actions từ billing và reviews vào module appointments.
 */

export default async function Appointments() {
  const today = new Date();
  const dateRange = {
    start: startOfMonth(today),
    end: endOfMonth(today),
  };

  const appointmentsPromise = getAppointments(dateRange);
  const staffListPromise = getStaffList();
  const resourceListPromise = getResourceList();
  const serviceListPromise = getServiceList();

  // const fullStaffList = MOCK_STAFF; // TODO: Remove or replace with proper data

  return (
    <Suspense fallback={<AppointmentsPageSkeleton />}>
      <AppointmentsPage
        appointmentsPromise={appointmentsPromise}
        staffListPromise={staffListPromise}
        resourceListPromise={resourceListPromise}
        serviceListPromise={serviceListPromise}
        // Injecting cross-feature actions (Dependency Injection)
        createInvoiceAction={createInvoice}
        getInvoiceAction={getInvoice}
        getBookingReviewAction={getBookingReview}
      />
    </Suspense>
  );
}
