// Gói dịch vụ - Service Package Entity
export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  validity_days: number; // Số ngày hiệu lực
  is_active: boolean;
  services: PackageService[];
  created_at: string;
  updated_at: string;
}

// Dịch vụ trong gói
export interface PackageService {
  service_id: string;
  service_name: string;
  quantity: number; // Số lượng buổi
}

// Input cho tạo/cập nhật
export interface PackageCreateInput {
  name: string;
  description?: string | null;
  price: number;
  validity_days: number;
  is_active?: boolean;
  services: { service_id: string; quantity: number }[];
}

export interface PackageUpdateInput extends Partial<PackageCreateInput> {
  id: string;
}

// Pagination response
export interface PaginatedPackages {
  data: ServicePackage[];
  total: number;
  page: number;
  limit: number;
}
