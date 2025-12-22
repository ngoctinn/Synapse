export type TreatmentStatus = "active" | "completed" | "cancelled" | "expired";

export interface CustomerTreatment {
  id: string;
  customer_id: string;
  customer_name: string; // Denormalized for display
  package_id: string;
  package_name: string; // Denormalized
  total_sessions: number;
  sessions_completed: number;
  start_date: string;
  end_date: string | null; // Có thể null nếu chưa kết thúc
  expiry_date: string; // Ngày hết hạn liệu trình
  status: TreatmentStatus;
  notes: string | null;
  progress: number; // Percentage 0-100
  created_at: string;
  updated_at: string;
}

export interface TreatmentSession {
  id: string;
  treatment_id: string;
  booking_id: string | null; // Có thể null nếu là session import hoặc manual log
  session_number: number;
  performed_at: string;
  notes: string | null;
  technician_name: string | null;
}

export interface TreatmentCreateInput {
  customer_id: string;
  package_id: string;
  start_date: string;
  notes?: string | null;
}

export interface PaginatedTreatments {
  data: CustomerTreatment[];
  total: number;
  page: number;
  limit: number;
}
