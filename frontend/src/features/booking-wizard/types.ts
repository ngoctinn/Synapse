export interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number; // minutes
  category_id?: string | null;
  image_url?: string | null;
}

export interface StaffItem {
  id: string;
  name: string;
  role?: string;
  avatar_url?: string;
  rating?: number;
  is_available?: boolean; // For specific date/time context
}

export interface TimeSlot {
  id: string; // Unique ID for the time slot
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  staff_id: string;
  resource_id?: string;
  is_available: boolean;
  is_held?: boolean;
}

export interface CustomerInfo {
  full_name: string;
  phone_number: string;
  email?: string;
  notes?: string;
}

export interface BookingState {
  // Step 1: Services
  selectedServices: ServiceItem[];

  // Step 2: Staff
  staffId: string | 'any' | null;
  staffName: string | null;

  // Step 3: Time
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  holdId: string | null;
  holdExpiresAt: Date | null;

  // Step 4: Payment/Customer
  customerInfo: CustomerInfo | null;

  // Navigation
  currentStep: 1 | 2 | 3 | 4;
}

export type BookingStep = 1 | 2 | 3 | 4;
