export * from "./actions";
export * from "./schemas";
export * from "./types";

export { AppSidebar } from "./components/app-sidebar";
export { AppointmentList } from "./components/appointment-list";
export { DashboardHeader } from "./components/dashboard-header";
export { DashboardNav } from "./components/dashboard-nav";
export { MobileNav } from "./components/mobile-nav";
export { NavMain } from "./components/nav-main";
export { ProfileForm } from "./components/profile-form";
export { TreatmentList } from "./components/treatment-list";

export {
    getCustomerAppointments,
    getCustomerProfile,
    getCustomerTreatments,
    updateCustomerProfile
} from "./services/api";

