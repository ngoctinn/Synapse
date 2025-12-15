"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Textarea,
} from "@/shared/ui";

import { CreateReviewFormValues, createReviewSchema } from "../schemas";
import { ReviewRating } from "../types";
import { StarRating } from "./star-rating";

interface ReviewFormProps {
  initialRating?: ReviewRating;
  initialComment?: string;
  onSubmit: (values: CreateReviewFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  initialRating,
  initialComment,
  onSubmit,
  onCancel,
  isSubmitting: externalSubmitting = false,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const isSubmitting = isPending || externalSubmitting;

  const form = useForm<CreateReviewFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createReviewSchema) as any,
    defaultValues: {
      rating: initialRating,
      comment: initialComment || "",
    },
  });

  const handleRatingChange = (newRating: ReviewRating) => {
    form.setValue("rating", newRating, { shouldValidate: true });
  };

  const handleSubmit = (values: CreateReviewFormValues) => {
    startTransition(async () => {
      await onSubmit(values);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đánh giá của bạn</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRatingChange={handleRatingChange}
                  size={30}
                  className="text-yellow-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bình luận (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            Gửi đánh giá
          </Button>
        </div>
      </form>
    </Form>
  );
}
