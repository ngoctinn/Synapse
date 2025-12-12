import { z } from "zod";

export const createPaymentSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, "Số tiền tối thiểu là 1.000đ")
    .positive("Số tiền phải lớn hơn 0"),
  method: z.enum(["CASH", "CARD", "TRANSFER"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  transactionRef: z.string().optional(),
  note: z.string().optional(),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
