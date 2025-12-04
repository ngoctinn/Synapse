import { createClient } from "@/shared/lib/supabase/server";
import { toCamelCase, toSnakeCase } from "@/shared/lib/utils";
import { Appointment, Treatment, UserProfile } from '../types';
import { MOCK_TREATMENTS } from './mock-data';

// Giả lập độ trễ mạng
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCustomerProfile = async (): Promise<UserProfile> => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Không có quyền truy cập");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/users/me`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    // Thêm cache: 'no-store' để đảm bảo dữ liệu luôn mới
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin hồ sơ");
  }

  const user = await response.json();
  const camelCaseUser = toCamelCase(user) as UserProfile;

  return {
    ...camelCaseUser,
    membershipTier: 'SILVER', // TODO: Lấy từ backend
    loyaltyPoints: 0, // TODO: Lấy từ backend
  };
};

export const getCustomerAppointments = async (): Promise<Appointment[]> => {
  // TODO: Thay thế bằng gọi API thực tế
  await delay(800);
  return [];
};

export const getCustomerTreatments = async (): Promise<Treatment[]> => {
  // TODO: Thay thế bằng gọi API thực tế
  await delay(600);
  return MOCK_TREATMENTS;
};

export const updateCustomerProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Không có quyền truy cập");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Chuyển đổi sang snake_case cho backend
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
    throw new Error(`Cập nhật hồ sơ thất bại: ${response.status} ${errorText}`);
  }

  const updatedUser = await response.json();
  const camelCaseUser = toCamelCase(updatedUser) as UserProfile;

  return {
    ...camelCaseUser,
    membershipTier: 'SILVER', // TODO: Lấy từ backend
    loyaltyPoints: 0, // TODO: Lấy từ backend
  };
};
