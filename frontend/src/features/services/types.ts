export interface Skill {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  buffer_time: number;
  price: number;
  image_url?: string | null;
  is_active: boolean;
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
