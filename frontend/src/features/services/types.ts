export interface Skill {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

/** Cấu hình thời gian sử dụng thiết bị trong timeline dịch vụ */
export interface EquipmentUsage {
  equipment_id: string;
  /** Thời điểm bắt đầu sử dụng (phút từ đầu dịch vụ) */
  start_offset: number;
  /** Thời lượng sử dụng (phút) */
  duration: number;
}

export interface ResourceRequirements {
  room_type_id?: string;
  /** Legacy: danh sách ID thiết bị (backward compatible) */
  equipment_ids: string[];
  /** New: cấu hình timeline sử dụng thiết bị */
  equipment_usage?: EquipmentUsage[];
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  buffer_time: number;
  price: number;
  image_url?: string | null;
  color: string;
  description?: string | null;
  category?: string | null; // Added for Landing Page
  resource_requirements?: ResourceRequirements;
  is_active: boolean;
  is_popular?: boolean; // Added for Landing Page
  skills: Skill[];
  created_at: string;
  updated_at: string;
}

export interface ServiceCreateInput {
  name: string;
  duration: number;
  buffer_time?: number;
  price?: number;
  image_url?: string;
  color?: string;
  description?: string;
  category?: string;
  resource_requirements?: ResourceRequirements;
  is_active?: boolean;
  skill_ids: string[];
  new_skills?: string[];
}

export interface ServiceUpdateInput {
  name?: string;
  duration?: number;
  buffer_time?: number;
  price?: number;
  image_url?: string;
  color?: string;
  description?: string;
  category?: string;
  resource_requirements?: ResourceRequirements;
  is_active?: boolean;
  skill_ids?: string[];
  new_skills?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SkillCreateInput {
  name: string;
  code: string;
  description?: string | null;
}

export interface SkillUpdateInput {
  name?: string;
  code?: string;
  description?: string | null;
}
