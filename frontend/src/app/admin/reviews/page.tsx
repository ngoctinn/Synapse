import { ReviewsAdminPage } from "@/features/reviews/components/reviews-admin-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Đánh giá | Synapse",
  description: "Quản lý các đánh giá của khách hàng",
};

export default function Page() {
  return <ReviewsAdminPage />;
}
