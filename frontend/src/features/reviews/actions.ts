"use server";

import { MOCK_APPOINTMENTS, MOCK_CUSTOMERS, MOCK_SERVICES } from "@/features/appointments/model/mocks";
import { MOCK_INVOICES } from "@/features/billing/model/mocks";
import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_REVIEWS } from "./model/mocks";
import { Review, ReviewCreateInput, ReviewFilters, ReviewUpdateInput } from "./model/types";

export async function createReview(input: ReviewCreateInput): Promise<ActionResponse<Review>> {
  try {
    const booking = MOCK_APPOINTMENTS.find((apt: any) => apt.id === input.bookingId);
    if (!booking) return error("Không tìm thấy lịch hẹn");
    if (booking.status !== "COMPLETED") return error("Chỉ có thể đánh giá dịch vụ đã hoàn thành");

    const invoice = MOCK_INVOICES.find((inv: any) => inv.bookingId === input.bookingId);
    if (!invoice || invoice.status !== "PAID") return error("Chỉ có thể đánh giá dịch vụ đã thanh toán hóa đơn");

    const existingReview = MOCK_REVIEWS.find((rev: any) => rev.bookingId === input.bookingId);
    if (existingReview) return error("Bạn đã đánh giá dịch vụ này rồi");

    const customer = MOCK_CUSTOMERS.find((c: any) => c.id === booking.customerId);
    const service = MOCK_SERVICES.find((s: any) => s.id === booking.serviceId);
    if (!customer || !service) return error("Dữ liệu liên kết không hợp lệ");

    const newReview: Review = {
      id: `REV-${Date.now()}`,
      bookingId: input.bookingId,
      customerId: booking.customerId,
      customerName: customer.name,
      serviceName: service.name,
      rating: input.rating,
      comment: input.comment || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_REVIEWS.unshift(newReview);
    revalidatePath("/admin/reviews");
    revalidatePath("/dashboard/reviews");

    return success(newReview, "Đánh giá của bạn đã được gửi!");
  } catch (e) {
    console.error(e);
    return error("Lỗi khi gửi đánh giá");
  }
}

export async function getReviews(filters?: ReviewFilters): Promise<ActionResponse<Review[]>> {
  try {
    let reviews = [...MOCK_REVIEWS];
    if (filters) {
      if (filters.rating && filters.rating.length > 0) {
        reviews = reviews.filter((rev: any) => filters.rating!.includes(rev.rating));
      }
      if (filters.serviceId) {
        reviews = reviews.filter((rev: any) => rev.serviceName.includes(MOCK_SERVICES.find((s: any) => s.id === filters.serviceId)?.name || ''));
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        reviews = reviews.filter(
          (rev: any) =>
            rev.customerName.toLowerCase().includes(query) ||
            rev.serviceName.toLowerCase().includes(query) ||
            rev.comment?.toLowerCase().includes(query)
        );
      }
    }
    reviews.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    return success(reviews);
  } catch (e) {
    console.error(e);
    return error("Không thể tải danh sách đánh giá");
  }
}

export async function getBookingReview(bookingId: string): Promise<ActionResponse<Review | null>> {
  try {
    const review = MOCK_REVIEWS.find((rev: any) => rev.bookingId === bookingId);
    return success(review || null);
  } catch (e) {
    console.error(e);
    return error("Không thể tải đánh giá");
  }
}

export async function updateReview(id: string, input: ReviewUpdateInput): Promise<ActionResponse<Review>> {
  try {
    const reviewIndex = MOCK_REVIEWS.findIndex((rev: any) => rev.id === id);
    if (reviewIndex === -1) return error("Không tìm thấy đánh giá");

    const updatedReview = {
      ...MOCK_REVIEWS[reviewIndex],
      comment: input.comment || undefined,
      updatedAt: new Date(),
    };

    MOCK_REVIEWS[reviewIndex] = updatedReview;
    revalidatePath("/admin/reviews");
    revalidatePath("/dashboard/reviews");

    return success(updatedReview, "Đánh giá đã được cập nhật");
  } catch (e) {
    console.error(e);
    return error("Không thể cập nhật đánh giá");
  }
}

export async function getMyReviews(customerId: string): Promise<ActionResponse<Review[]>> {
    try {
        const myReviews = MOCK_REVIEWS.filter((rev: any) => rev.customerId === customerId);
        myReviews.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
        return success(myReviews);
    } catch (e) {
        console.error(e);
        return error("Không thể tải đánh giá của bạn");
    }
}
