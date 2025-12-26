"use client";

import { Frown } from "lucide-react";
import { Review } from "../model/types";
import { ReviewCard } from "./review-card";
import { Stack, Grid } from "@/shared/ui/layout";

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
      <Stack align="center" justify="center" className="text-muted-foreground py-8 text-center">
        <Frown size={48} />
        <p className="text-sm">{emptyMessage}</p>
      </Stack>
    );
  }

  return (
    <Stack gap={6}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <Grid gap={4}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Grid>
    </Stack>
  );
}
