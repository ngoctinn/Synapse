export type MembershipTier = "SILVER" | "GOLD" | "PLATINUM";
export type Gender = "MALE" | "FEMALE" | "OTHER";

/**
 * Customer - Flatten type cho UI display
 * Mapping từ DB: users (id, email, full_name, phone_number, avatar_url, is_active, created_at, updated_at)
 *             + customer_profiles (loyalty_points, membership_tier, gender, date_of_birth, address, allergies, medical_notes, preferred_staff_id)
 * Note: `id` = users.id (UUID). Backend JOIN 2 bảng và trả về flatten object.
 */
export interface Customer {
  /** users.id - Primary identifier */
  id: string;
  phone_number: string | null;
  full_name: string;
  email: string | null;

  avatar_url: string | null;
  is_active: boolean;

  loyalty_points: number;
  membership_tier: MembershipTier;

  gender: Gender | null;
  date_of_birth: string | null;
  address: string | null;

  allergies: string | null;
  medical_notes: string | null;

  preferred_staff_id: string | null;

  created_at: string;
  updated_at: string;
}
