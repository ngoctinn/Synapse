import { subDays } from "date-fns";
import { Review } from "./types";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "REV-001",
    bookingId: "apt-5", // From appointments mock (completed)
    customerId: "cust-5",
    customerName: "Hoàng Minh Đức",
    serviceName: "Chăm sóc da mặt cơ bản",
    rating: 5,
    comment:
      "Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp. Tôi rất hài lòng!",
    createdAt: subDays(new Date(), 7),
    updatedAt: subDays(new Date(), 7),
  },
  {
    id: "REV-002",
    bookingId: "apt-1", // From appointments mock (completed)
    customerId: "cust-1",
    customerName: "Nguyễn Văn An",
    serviceName: "Massage toàn thân 60'",
    rating: 4,
    comment: "Massage thư giãn, nhưng phòng hơi lạnh một chút.",
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 5),
  },
  {
    id: "REV-003",
    bookingId: "apt-10", // From appointments mock (completed)
    customerId: "cust-2",
    customerName: "Trần Thị Bình",
    serviceName: "Massage toàn thân 90'",
    rating: 5,
    comment: "Trải nghiệm tuyệt vời! Sẽ quay lại.",
    createdAt: subDays(new Date(), 2),
    updatedAt: subDays(new Date(), 2),
  },
];
