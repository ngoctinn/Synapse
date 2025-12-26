"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Review } from "../model/types";
import { StarRating } from "./star-rating";
import { Stack, Group } from "@/shared/ui/layout";

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
    <Group align="start" gap={4} className="bg-card rounded-lg border p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.customerName}`}
        />
        <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
      </Avatar>
      <Stack gap={2} className="flex-1">
        <Group justify="between">
          <Stack gap={0}>
            <p className="font-semibold">{review.customerName}</p>
            <p className="text-muted-foreground text-sm">
              {review.serviceName}
            </p>
          </Stack>
          <StarRating rating={review.rating} size={16} readOnly />
        </Group>
        {review.comment && (
          <p className="text-muted-foreground text-sm italic">
            &quot;{review.comment}&quot;
          </p>
        )}
        <p className="text-muted-foreground text-right text-xs">
          {format(review.createdAt, "dd/MM/yyyy", { locale: vi })}
        </p>
      </Stack>
    </Group>
  );
}
