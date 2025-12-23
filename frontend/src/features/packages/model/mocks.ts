import { ServicePackage } from "./types";

export const MOCK_PACKAGES: ServicePackage[] = [
  {
    id: "pkg-1",
    name: "Gói Chăm Sóc Da Cơ Bản",
    description: "Combo 5 buổi chăm sóc da mặt cơ bản + 2 buổi massage body",
    price: 2500000,
    validity_days: 90,
    is_active: true,
    services: [
      { service_id: "svc-1", service_name: "Chăm sóc da mặt", quantity: 5 },
      {
        service_id: "svc-2",
        service_name: "Massage body thư giãn",
        quantity: 2,
      },
    ],
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "pkg-2",
    name: "Gói Trẻ Hóa Da Premium",
    description: "10 buổi treatment trẻ hóa da chuyên sâu với công nghệ cao",
    price: 8500000,
    validity_days: 180,
    is_active: true,
    services: [
      { service_id: "svc-3", service_name: "Trẻ hóa da RF", quantity: 5 },
      { service_id: "svc-4", service_name: "Peel da chuyên sâu", quantity: 3 },
      { service_id: "svc-5", service_name: "Vitamin C Therapy", quantity: 2 },
    ],
    created_at: "2024-02-20T10:30:00Z",
    updated_at: "2024-02-20T10:30:00Z",
  },
  {
    id: "pkg-3",
    name: "Gói Thư Giãn Toàn Thân",
    description: "Combo massage + xông hơi dành cho khách hàng cần thư giãn",
    price: 1800000,
    validity_days: 60,
    is_active: true,
    services: [
      {
        service_id: "svc-2",
        service_name: "Massage body thư giãn",
        quantity: 4,
      },
      { service_id: "svc-6", service_name: "Xông hơi thảo dược", quantity: 4 },
    ],
    created_at: "2024-03-10T14:00:00Z",
    updated_at: "2024-03-10T14:00:00Z",
  },
  {
    id: "pkg-4",
    name: "Gói Detox & Thanh Lọc",
    description: "Liệu trình thanh lọc cơ thể và detox da mặt",
    price: 3200000,
    validity_days: 120,
    is_active: false,
    services: [
      { service_id: "svc-7", service_name: "Detox cơ thể", quantity: 3 },
      { service_id: "svc-8", service_name: "Thanh lọc da mặt", quantity: 3 },
      { service_id: "svc-6", service_name: "Xông hơi thảo dược", quantity: 2 },
    ],
    created_at: "2024-04-05T09:15:00Z",
    updated_at: "2024-04-05T09:15:00Z",
  },
];
