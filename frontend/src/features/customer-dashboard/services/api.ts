import { Appointment, Treatment, UserProfile } from '../types';
import { MOCK_APPOINTMENTS, MOCK_TREATMENTS, MOCK_USER } from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCustomerProfile = async (): Promise<UserProfile> => {
  await delay(500);
  return MOCK_USER;
};

export const getCustomerAppointments = async (): Promise<Appointment[]> => {
  await delay(800);
  return MOCK_APPOINTMENTS;
};

export const getCustomerTreatments = async (): Promise<Treatment[]> => {
  await delay(600);
  return MOCK_TREATMENTS;
};

export const updateCustomerProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(1000);
  return { ...MOCK_USER, ...data };
};
