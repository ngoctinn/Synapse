"use client";

import { Frown } from "lucide-react";
import { Review } from "../model/types";
import { ReviewCard } from "./review-card";

interface ReviewListProps {
  reviews: Review[];
  title?: string;
  emptyMessage?: string;
}

export function ReviewList({
  reviews,
  title,
  emptyMessage = "Chưa có đánh giá nào.",
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Frown className="h-12 w-12" />
        <p className="mt-3 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <div className="grid gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
