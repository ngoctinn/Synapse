import { z } from 'zod';

export const customerInfoSchema = z.object({
  full_name: z.string().min(2, 'Vui lòng nhập họ tên (tối thiểu 2 ký tự)'),
  phone_number: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type CustomerInfoSchema = z.infer<typeof customerInfoSchema>;

export const bookingConfirmationSchema = z.object({
  holdId: z.string().uuid(),
  customerInfo: customerInfoSchema,
  paymentMethod: z.enum(['COD', 'ONLINE']),
});
