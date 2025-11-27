export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  serviceName: string;
  startTime: string; // ISO String
  durationMinutes: number;
  status: AppointmentStatus;
  location?: string;
  technicianName?: string;
}

export type TreatmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface Treatment {
  id: string;
  packageName: string;
  totalSessions: number;
  usedSessions: number;
  status: TreatmentStatus;
  purchaseDate: string; // ISO String
  expiryDate?: string; // ISO String
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  membershipTier?: 'SILVER' | 'GOLD' | 'PLATINUM';
  loyaltyPoints?: number;
}
