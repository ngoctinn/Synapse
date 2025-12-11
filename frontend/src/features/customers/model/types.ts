export type MembershipTier = "SILVER" | "GOLD" | "PLATINUM"
export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface Customer {
  id: string
  // Identity
  phone_number: string
  full_name: string
  email: string | null
  user_id: string | null // Link to App Account (Optional)

  // Profile Info
  avatar_url: string | null
  is_active: boolean

  // CRM Data
  loyalty_points: number
  membership_tier: MembershipTier

  // Demographics
  gender: Gender | null
  date_of_birth: string | null
  address: string | null

  // Medical / Notes
  allergies: string | null
  medical_notes: string | null

  preferred_staff_id: string | null

  created_at: string
  updated_at: string
}
