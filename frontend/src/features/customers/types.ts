export type MembershipTier = "SILVER" | "GOLD" | "PLATINUM"
export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface Customer {
  user_id: string
  user: {
    id: string
    email: string
    full_name: string
    phone_number: string | null
    avatar_url: string | null
    is_active: boolean
    created_at: string
  }
  loyalty_points: number
  membership_tier: MembershipTier
  gender: Gender | null
  date_of_birth: string | null
  address: string | null
  allergies: string | null
  medical_notes: string | null
  preferred_staff_id: string | null
}
