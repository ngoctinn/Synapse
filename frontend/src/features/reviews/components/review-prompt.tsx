"use client";

import { useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { createReview } from "../actions";
import { ReviewForm } from "./review-form";
import { CreateReviewFormValues } from "../schemas";
import { Loader2 } from "lucide-react";

interface ReviewPromptProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmitted?: () => void;
  customerName: string; // To personalize the prompt
  serviceName: string; // To personalize the prompt
}

export function ReviewPrompt({
  bookingId,
  open,
  onOpenChange,
  onReviewSubmitted,
  customerName,
  serviceName,
}: ReviewPromptProps) {
  const [isSubmitting, startTransition] = useTransition();

  const handleReviewSubmit = async (values: CreateReviewFormValues) => {
    startTransition(async () => {
      const result = await createReview({ bookingId, ...values });
      if (result.status === "success") {
        toast.success(result.message);
        onOpenChange(false);
        onReviewSubmitted?.();
      } else {
        toast.error(result.message || "Gửi đánh giá thất bại");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn đã sử dụng dịch vụ {serviceName}</DialogTitle>
          <DialogDescription>
            Chào {customerName}, bạn có thể chia sẻ trải nghiệm của mình về dịch vụ này chứ?
            Đánh giá của bạn sẽ giúp chúng tôi cải thiện chất lượng phục vụ.
          </DialogDescription>
        </DialogHeader>

        <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
