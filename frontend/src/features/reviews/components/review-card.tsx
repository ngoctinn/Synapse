"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Review } from "../model/types";
import { StarRating } from "./star-rating";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-card flex items-start space-x-4 rounded-lg border p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.customerName}`}
        />
        <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.customerName}</p>
            <p className="text-muted-foreground text-sm">
              {review.serviceName}
            </p>
          </div>
          <StarRating rating={review.rating} size={16} readOnly />
        </div>
        {review.comment && (
          <p className="text-muted-foreground text-sm italic">
            &quot;{review.comment}&quot;
          </p>
        )}
        <p className="text-muted-foreground text-right text-xs">
          {format(review.createdAt, "dd/MM/yyyy", { locale: vi })}
        </p>
      </div>
    </div>
  );
}
