export type WarrantyStatus = "active" | "expired" | "voided" | "claimed";

export interface WarrantyTicket {
  id: string;
  code: string; // Mã bảo hành (WB-XXX)
  customer_id: string;
  customer_name: string;
  treatment_id: string; // Liên kết với liệu trình
  service_name: string;
  start_date: string;
  end_date: string;
  terms: string; // Điều khoản bảo hành
  status: WarrantyStatus;
  created_at: string;
  updated_at: string;
}

export interface WarrantyCreateInput {
  customer_id: string;
  treatment_id: string;
  duration_months: number;
  terms: string;
}

export interface PaginatedWarranties {
  data: WarrantyTicket[];
  total: number;
  page: number;
  limit: number;
}
