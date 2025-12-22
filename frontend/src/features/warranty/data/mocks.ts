import { WarrantyTicket } from "../types";

export const MOCK_WARRANTIES: WarrantyTicket[] = [
  {
    id: "warr-1",
    code: "WB-2405001",
    customer_id: "cust-1",
    customer_name: "Nguyễn Văn A",
    treatment_id: "tmt-1",
    service_name: "Điều trị mụn chuyên sâu",
    start_date: "2024-05-01T00:00:00Z",
    end_date: "2024-11-01T00:00:00Z", // 6 months
    terms: "Bảo hành tái phát mụn trong vòng 6 tháng. Miễn phí 100% chi phí xử lý.",
    status: "active",
    created_at: "2024-05-01T10:00:00Z",
    updated_at: "2024-05-01T10:00:00Z",
  },
  {
    id: "warr-2",
    code: "WB-2312099",
    customer_id: "cust-2",
    customer_name: "Trần Thị B",
    treatment_id: "tmt-2",
    service_name: "Phun xăm lông mày",
    start_date: "2023-12-15T00:00:00Z",
    end_date: "2024-03-15T00:00:00Z", // 3 months
    terms: "Dặm lại miễn phí 1 lần trong vòng 3 tháng.",
    status: "expired",
    created_at: "2023-12-15T14:00:00Z",
    updated_at: "2024-03-16T00:00:00Z",
  },
];
