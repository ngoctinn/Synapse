"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";

import { ReviewRating } from "../types";
import { CreateReviewFormValues, createReviewSchema } from "../schemas";
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
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: initialRating || 0, // Using 0 as a placeholder for "not rated"
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
                  rows={4}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi đánh giá
          </Button>
        </div>
      </form>
    </Form>
  );
}
