export interface Skill {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

export interface ServiceCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface ResourceGroup {
  id: string;
  name: string;
  description?: string | null;
  /** "BED" | "EQUIPMENT" */
  type: string;
}

export interface ServiceResourceRequirement {
  group_id: string;
  quantity: number;
  /** Thời điểm bắt đầu sử dụng (phút từ đầu dịch vụ) */
  start_delay: number;
  /** Thời lượng sử dụng (phút). Nếu null -> dùng suốt thời gian dịch vụ */
  usage_duration?: number | null;
  /** Optional: Embedded group details for UI convenience */
  group?: ResourceGroup;
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
  category_id?: string | null;
  is_active: boolean;
  is_popular?: boolean;
  skills: Skill[];
  resource_requirements: ServiceResourceRequirement[];
  created_at: string;
  updated_at: string;
  /** Optional: Embedded category details */
  category?: ServiceCategory;
}

export interface ServiceCreateInput {
  name: string;
  duration: number;
  buffer_time?: number;
  price?: number;
  image_url?: string;
  color?: string;
  description?: string;
  category_id?: string;
  resource_requirements?: ServiceResourceRequirement[];
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
  category_id?: string;
  resource_requirements?: ServiceResourceRequirement[];
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
