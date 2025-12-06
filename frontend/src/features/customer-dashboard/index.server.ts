/**
 * Server-only exports cho Customer Dashboard feature.
 * CHỈ được import trong Server Components hoặc Server Actions.
 *
 * Ví dụ:
 * ```tsx
 * // app/(dashboard)/page.tsx (Server Component)
 * import { getCustomerProfile } from "@/features/customer-dashboard/index.server"
 * ```
 */

export {
    getCustomerAppointments,
    getCustomerProfile,
    getCustomerTreatments,
    updateCustomerProfile
} from "./services/api";
