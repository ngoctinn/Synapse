"use client";

import { showToast } from "@/shared/ui/sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { useTransition } from "react";
import { createReview } from "../actions";
import { CreateReviewFormValues } from "../schemas";
import { ReviewForm } from "./review-form";

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
        showToast.success("Đánh giá thành công", result.message);
        onOpenChange(false);
        onReviewSubmitted?.();
      } else {
        showToast.error("Đánh giá thất bại", result.message || "Gửi đánh giá thất bại");
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
