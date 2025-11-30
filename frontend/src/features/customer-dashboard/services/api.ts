import { createClient } from "@/shared/lib/supabase/server";
import { toCamelCase, toSnakeCase } from "@/shared/lib/utils";
import { Appointment, Treatment, UserProfile } from '../types';
import { MOCK_APPOINTMENTS, MOCK_TREATMENTS } from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCustomerProfile = async (): Promise<UserProfile> => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/users/me`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    // Add cache: 'no-store' to ensure fresh data
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const user = await response.json();
  const camelCaseUser = toCamelCase(user) as UserProfile;

  return {
    ...camelCaseUser,
    membershipTier: 'SILVER', // TODO: Fetch from backend
    loyaltyPoints: 0, // TODO: Fetch from backend
  };
};

export const getCustomerAppointments = async (): Promise<Appointment[]> => {
  // TODO: Replace with real API call
  await delay(800);
  return MOCK_APPOINTMENTS;
};

export const getCustomerTreatments = async (): Promise<Treatment[]> => {
  // TODO: Replace with real API call
  await delay(600);
  return MOCK_TREATMENTS;
};

export const updateCustomerProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Convert to snake_case for backend
  const payload = toSnakeCase(data);

  const response = await fetch(`${apiUrl}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
  }

  const updatedUser = await response.json();
  const camelCaseUser = toCamelCase(updatedUser) as UserProfile;

  return {
    ...camelCaseUser,
    membershipTier: 'SILVER', // TODO: Fetch from backend
    loyaltyPoints: 0, // TODO: Fetch from backend
  };
};
