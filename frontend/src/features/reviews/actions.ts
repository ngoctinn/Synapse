"use server";

import { MOCK_APPOINTMENTS, MOCK_CUSTOMERS, MOCK_SERVICES } from "@/features/appointments/mock-data";
import { MOCK_INVOICES } from "@/features/billing/mock-data";
import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_REVIEWS } from "./mock-data";
import { Review, ReviewCreateInput, ReviewFilters, ReviewUpdateInput } from "./types";

// Simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createReview(
  input: ReviewCreateInput
): Promise<ActionResponse<Review>> {
  try {
    await delay(500);

    // Business Rule: Chỉ review khi booking COMPLETED VÀ invoice PAID
    const booking = MOCK_APPOINTMENTS.find((apt) => apt.id === input.bookingId);
    if (!booking) {
      return error("Không tìm thấy lịch hẹn");
    }
    if (booking.status !== "completed") {
      return error("Chỉ có thể đánh giá dịch vụ đã hoàn thành");
    }

    const invoice = MOCK_INVOICES.find((inv) => inv.bookingId === input.bookingId);
    if (!invoice || invoice.status !== "PAID") {
      return error("Chỉ có thể đánh giá dịch vụ đã thanh toán hóa đơn");
    }

    // Business Rule: Unique - 1 booking = 1 review
    const existingReview = MOCK_REVIEWS.find(
      (rev) => rev.bookingId === input.bookingId
    );
    if (existingReview) {
      return error("Bạn đã đánh giá dịch vụ này rồi");
    }

    const customer = MOCK_CUSTOMERS.find(c => c.id === booking.customerId);
    const service = MOCK_SERVICES.find(s => s.id === booking.serviceId);

    if (!customer || !service) {
      return error("Dữ liệu liên kết không hợp lệ");
    }

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
    revalidatePath("/dashboard/reviews"); // For customer dashboard

    return success(newReview, "Đánh giá của bạn đã được gửi!");
  } catch (e) {
    console.error(e);
    return error("Lỗi khi gửi đánh giá");
  }
}

export async function getReviews(
  filters?: ReviewFilters
): Promise<ActionResponse<Review[]>> {
  try {
    await delay(300);
    let reviews = [...MOCK_REVIEWS];

    if (filters) {
      if (filters.rating && filters.rating.length > 0) {
        reviews = reviews.filter((rev) => filters.rating!.includes(rev.rating));
      }
      if (filters.serviceId) {
        reviews = reviews.filter((rev) => rev.serviceName.includes(MOCK_SERVICES.find(s => s.id === filters.serviceId)?.name || ''));
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        reviews = reviews.filter(
          (rev) =>
            rev.customerName.toLowerCase().includes(query) ||
            rev.serviceName.toLowerCase().includes(query) ||
            rev.comment?.toLowerCase().includes(query)
        );
      }
      // Date filtering
    }

    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return success(reviews);
  } catch (e) {
    console.error(e);
    return error("Không thể tải danh sách đánh giá");
  }
}

export async function getBookingReview(
  bookingId: string
): Promise<ActionResponse<Review | null>> {
  try {
    await delay(200);
    const review = MOCK_REVIEWS.find((rev) => rev.bookingId === bookingId);
    return success(review || null);
  } catch (e) {
    console.error(e);
    return error("Không thể tải đánh giá");
  }
}

export async function updateReview(
  id: string,
  input: ReviewUpdateInput
): Promise<ActionResponse<Review>> {
  try {
    await delay(500);
    const reviewIndex = MOCK_REVIEWS.findIndex((rev) => rev.id === id);
    if (reviewIndex === -1) {
      return error("Không tìm thấy đánh giá");
    }

    const review = MOCK_REVIEWS[reviewIndex];
    // Business Rule: Không xóa được, chỉ edit comment
    const updatedReview = {
      ...review,
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
        await delay(300);
        const myReviews = MOCK_REVIEWS.filter(rev => rev.customerId === customerId);
        myReviews.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
        return success(myReviews);
    } catch (e) {
        console.error(e);
        return error("Không thể tải đánh giá của bạn");
    }
}
