import { z } from "zod";
import { ReviewRating } from "./types";

export const createReviewSchema = z.object({
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)], {
    error: "Vui lòng chọn số sao đánh giá (từ 1 đến 5)",
  }),
  comment: z.string().max(500, "Bình luận không được vượt quá 500 ký tự").optional(),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  comment: z.string().max(500, "Bình luận không được vượt quá 500 ký tự").optional(),
});

export type UpdateReviewFormValues = z.infer<typeof updateReviewSchema>;
