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

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone_number,
    avatarUrl: user.avatar_url,
    address: user.address,
    dateOfBirth: user.date_of_birth,
    membershipTier: 'SILVER',
    loyaltyPoints: 0,
  };
};

export const getCustomerAppointments = async (): Promise<Appointment[]> => {
  await delay(800);
  return MOCK_APPOINTMENTS;
};

export const getCustomerTreatments = async (): Promise<Treatment[]> => {
  await delay(600);
  return MOCK_TREATMENTS;
};

import { createClient } from "@/shared/lib/supabase/server";

export const updateCustomerProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Map frontend camelCase to backend snake_case
  // Convert empty strings to null for backend validation
  const payload = {
    full_name: data.fullName,
    phone_number: data.phone || null,
    avatar_url: data.avatarUrl || null,
    address: data.address || null,
    date_of_birth: data.dateOfBirth || null,
  };

  console.log("Updating profile with payload:", payload);

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
    console.error("Backend Error:", response.status, errorText);
    throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
  }

  const updatedUser = await response.json();

  // Map backend snake_case back to frontend camelCase
  return {
    id: updatedUser.id,
    fullName: updatedUser.full_name,
    email: updatedUser.email,
    phone: updatedUser.phone_number,
    avatarUrl: updatedUser.avatar_url,
    address: updatedUser.address,
    dateOfBirth: updatedUser.date_of_birth,
    membershipTier: 'SILVER', // Default or fetch from backend if available
    loyaltyPoints: 0, // Default or fetch from backend if available
  };
};
