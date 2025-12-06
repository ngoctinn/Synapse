/**
 * Public API cho Customer Dashboard feature.
 * Chỉ chứa client-safe exports.
 *
 * Đối với server-only functions (API calls), import từ:
 * `@/features/customer-dashboard/index.server`
 */

export * from "./actions";
export * from "./constants";
export * from "./schemas";
export * from "./types";

// Components
export { AppSidebar } from "./components/app-sidebar";
export { AppointmentList } from "./components/appointment-list";

export { DashboardHeader } from "./components/dashboard-header";
export { DashboardNav } from "./components/dashboard-nav";
export { DashboardStats } from "./components/dashboard-stats";
export { MobileNav } from "./components/mobile-nav";
export { NavMain } from "./components/nav-main";
export { ProfileForm } from "./components/profile-form";

export { BookingDialog } from "./components/booking-dialog";
export { TreatmentList } from "./components/treatment-list";



