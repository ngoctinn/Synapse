"use client";

import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ReviewRating } from "../types";

interface StarRatingProps {
  rating: ReviewRating;
  maxRating?: number;
  onRatingChange?: (rating: ReviewRating) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 20,
  className,
  readOnly = false,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = (index + 1) as ReviewRating;
    const isFilled = starValue <= rating;

    return (
      <Star
        key={index}
        size={size}
        className={cn(
          isFilled ? "text-yellow-400" : "text-gray-300",
          !readOnly && onRatingChange && "cursor-pointer hover:text-yellow-500",
          className
        )}
        onClick={() => !readOnly && onRatingChange?.(starValue)}
        fill={isFilled ? "currentColor" : "none"}
        stroke="currentColor"
      />
    );
  });

  return (
    <div className="flex items-center">
      {stars}
    </div>
  );
}
