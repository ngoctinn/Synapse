export type Gender = "MALE" | "FEMALE" | "OTHER";

/**
 * Customer - Flatten type cho UI display
 * Mapping từ DB: customers table (standalone entity, decoupled from users)
 * Note: `id` = customers.id (UUID).
 */
export interface Customer {
  /** customers.id - Primary identifier */
  id: string;
  phone_number: string | null;
  full_name: string;
  email: string | null;

  avatar_url: string | null;
  is_active: boolean;

  gender: Gender | null;
  date_of_birth: string | null;
  address: string | null;

  allergies: string | null;
  medical_notes: string | null;

  preferred_staff_id: string | null;

  created_at: string;
  updated_at: string;
}

export type TechnicianOption = {
  id: string;
  name: string;
};

export type CustomerListResponse = {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
};
