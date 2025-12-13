export type MembershipTier = "SILVER" | "GOLD" | "PLATINUM"
export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface Customer {
  id: string
  phone_number: string
  full_name: string
  email: string | null
  user_id: string | null

  avatar_url: string | null
  is_active: boolean

  loyalty_points: number
  membership_tier: MembershipTier

  gender: Gender | null
  date_of_birth: string | null
  address: string | null

  allergies: string | null
  medical_notes: string | null

  preferred_staff_id: string | null

  created_at: string
  updated_at: string
}
