export type WaitlistStatus = "pending" | "notified" | "converted" | "cancelled" | "expired";

export interface WaitlistEntry {
  id: string;
  customer_id: string;
  customer_name: string; // Denormalized
  phone_number: string;
  service_id: string;
  service_name: string; // Denormalized
  preferred_date: string; // ISO Date only
  preferred_time_slot: string; // "Morning", "Afternoon", "Evening" or specific time
  notes: string | null;
  status: WaitlistStatus;
  created_at: string;
  updated_at: string;
}

export interface WaitlistCreateInput {
  customer_id?: string;
  customer_name: string;
  phone_number: string;
  service_id: string;
  preferred_date: string;
  preferred_time_slot: string;
  notes?: string | null;
}

export interface PaginatedWaitlist {
  data: WaitlistEntry[];
  total: number;
  page: number;
  limit: number;
}
