---
phase: requirements
title: Yêu cầu & Hiểu biết Vấn đề - Booking Wizard
description: Tính năng đặt lịch Spa đa bước (4 steps) với Real-time Availability và Temporary Hold
feature: booking-wizard
status: reviewed
created: 2025-12-13
updated: 2025-12-13
decisions:
  - entry_point: "Landing Page CTA → /booking page"
  - platform: "Responsive (Desktop + Mobile)"
  - backend: "Mock data Phase 1, OR-Tools Phase 2"
  - payment: "Mock COD flow"
  - notification: "Zalo ZNS"
  - cancel_flow: "Redirect to Customer Dashboard"
  - entity: "Creates Appointment (reuse existing model)"
---

# Yêu cầu & Hiểu biết Vấn đề: Booking Wizard

## Tuyên bố Vấn đề

**Chúng ta đang giải quyết vấn đề gì?**

### Vấn đề cốt lõi
1. **Double Booking (Trùng lịch)**: Khi 2+ khách hàng cùng chọn một slot giờ, dẫn đến xung đột lịch hẹn.
2. **Cognitive Overload**: Giao diện đặt lịch phức tạp làm giảm tỷ lệ hoàn tất (conversion rate).
3. **No-Show (Khách không đến)**: Thiếu cam kết thanh toán trước dẫn đến slot bị lãng phí.
4. **Thiếu Real-time Feedback**: Khách không biết slot vừa bị đặt vào lúc họ đang cân nhắc.

### Đối tượng bị ảnh hưởng
- **Khách hàng Spa (End-User)**: Muốn đặt lịch nhanh, thuận tiện, biết rõ giờ trống.
- **Lễ tân (Receptionist)**: Cần quản lý lịch hẹn, xử lý ngoại lệ (override, manual hold).
- **Spa Owner**: Mất doanh thu do No-Show và lịch trống không tối ưu.

### Giải pháp thay thế hiện tại
- Đặt lịch qua điện thoại (thủ công, tốn thời gian).
- Đặt lịch qua Facebook/Zalo (không có hệ thống quản lý slot).
- Module `/appointments` hiện tại chỉ dành cho **Admin/Lễ tân**, chưa có giao diện cho khách hàng.

---

## Mục tiêu & Mục đích

**Chúng ta muốn đạt được điều gì?**

### Mục tiêu chính
- [ ] Tạo luồng đặt lịch 4 bước tối ưu: **Service → Technician → Time → Payment**.
- [ ] Triển khai cơ chế **Temporary Hold** (Giữ chỗ tạm thời) 5 phút với Supabase Realtime.
- [ ] Đảm bảo giao diện **Mobile-first, Thumb-friendly** (max 3 hành động/màn hình).
- [ ] Tích hợp OR-Tools để tính toán slot thông minh dựa trên thời lượng dịch vụ + KTV.

### Mục tiêu phụ
- [ ] Hỗ trợ **Guest Checkout** (đặt lịch không cần đăng ký tài khoản).
- [ ] Hiển thị **Countdown Timer** cảnh báo hết giờ giữ chỗ.
- [ ] Cho phép chọn **"Bất kỳ KTV"** để mở rộng slot khả dụng.
- [ ] Responsive trên cả Desktop và Mobile.

### Phi mục tiêu (Ngoài phạm vi MVP)
- ❌ Dynamic Pricing (giá linh hoạt theo giờ cao/thấp điểm).
- ❌ Tích hợp lịch Google Calendar của khách hàng.
- ❌ Giao diện Lễ tân (Quick Add) - sẽ phát triển riêng.
- ❌ Recurring Booking (đặt lịch định kỳ) cho khách hàng.

---

## Câu chuyện Người dùng & Trường hợp Sử dụng

**Người dùng sẽ tương tác với giải pháp như thế nào?**

### User Stories

#### Khách hàng (End-User)

| ID | Story | Tiêu chí chấp nhận |
|----|-------|-------------------|
| US-01 | Là khách hàng, tôi muốn **xem danh sách dịch vụ theo danh mục** để chọn dịch vụ phù hợp nhanh chóng. | Danh sách phân nhóm (Massage, Chăm sóc da, v.v.); có thanh tìm kiếm; hiển thị giá + thời lượng. |
| US-02 | Là khách hàng, tôi muốn **chọn nhiều dịch vụ cùng lúc** để đặt combo và tiết kiệm thời gian. | Cho phép multi-select; hiển thị tổng tiền + tổng thời gian trên Floating Bar. |
| US-03 | Là khách hàng, tôi muốn **chọn "Bất kỳ KTV"** để có nhiều slot giờ hơn. | Option "Bất kỳ ai" ở đầu danh sách; microcopy: "Được đề xuất để có nhiều khung giờ trống nhất". |
| US-04 | Là khách hàng, tôi muốn **chọn KTV yêu thích** nếu có. | Hiển thị rating, avatar, chỉ báo "Có chỗ hôm nay". |
| US-05 | Là khách hàng, tôi muốn **xem slot giờ theo buổi (Sáng/Chiều/Tối)** để dễ chọn. | Nhóm slot theo buổi; vuốt ngang chọn ngày; slot khả dụng có thể chạm được. |
| US-06 | Là khách hàng, tôi muốn **được giữ chỗ 5 phút** khi chọn slot để không bị mất lịch khi thanh toán. | Countdown Timer hiển thị; slot bị lock trên các client khác (Realtime). |
| US-07 | Là khách hàng, tôi muốn **thanh toán tại quầy hoặc online** tùy chọn. | Hỗ trợ COD + E-Wallet/Card; Guest Checkout không cần tạo tài khoản. |
| US-08 | Là khách hàng, tôi muốn **xem tóm tắt trước khi xác nhận** để kiểm tra lại thông tin. | Booking Summary Card hiển thị đầy đủ: dịch vụ, KTV, ngày giờ, tổng tiền. |

#### Thông báo & Xác nhận (Zalo ZNS)

| ID | Story | Tiêu chí chấp nhận |
|----|-------|-------------------|
| US-11 | Là khách hàng, tôi muốn **nhận ZNS xác nhận** sau khi đặt lịch thành công. | ZNS chứa: Mã booking, Dịch vụ, KTV, Thời gian, Địa chỉ Spa. |
| US-12 | Là khách hàng, tôi muốn **nhận nhắc nhở** trước lịch hẹn (24h và 2h). | ZNS reminder với nút Xác nhận hoặc Hủy. |

#### Quản lý Booking (Customer Dashboard)

| ID | Story | Tiêu chí chấp nhận |
|----|-------|-------------------|
| US-13 | Là khách hàng đã đăng nhập, tôi muốn **tự động điền thông tin** từ profile. | Name, Phone auto-fill; không cần nhập lại. |
| US-14 | Là khách hàng, tôi muốn **hủy lịch hẹn** trước 2 giờ. | Redirect sang Customer Dashboard để hủy; áp dụng cancel policy. |

#### Lễ tân (Receptionist) - Future Scope
| ID | Story | Ghi chú |
|----|-------|---------|
| US-15 | Là lễ tân, tôi muốn **xem slot đang bị giữ chỗ** để biết trạng thái realtime. | Hiển thị badge "Đang giữ" trên Calendar View. |
| US-16 | Là lễ tân, tôi muốn **override giữ chỗ** nếu cần. | Admin action - Phase 2. |

### Quy trình làm việc chính (Main Workflow)

```
[Landing Page] → Click "Đặt Lịch Ngay"
      ↓
[Bước 1: Chọn Dịch Vụ]
      ↓ (Tiếp tục)
[Bước 2: Chọn Kỹ Thuật Viên]
      ↓ (Tiếp tục)
[Bước 3: Chọn Ngày & Giờ] ← OR-Tools tính slot khả dụng
      ↓ (Chọn slot → Trigger Temporary Hold 5 phút)
[Bước 4: Thanh Toán & Xác Nhận]
      ↓ (Xác nhận)
[Success Screen] → Thông tin lịch hẹn + Hướng dẫn
```

### Trường hợp biên (Edge Cases)

| Edge Case | Xử lý | UI Response |
|-----------|-------|-------------|
| **Hết slot** | Check slots.length === 0 | Toast "Ngày này đã kín" + suggest ngày khác |
| **Hết giờ giữ chỗ** | Timer expires | Modal + release hold + quay lại Step 3 |
| **KTV đã kín lịch** | Filter disabled staff | Ẩn hoặc disable KTV trong danh sách |
| **Payment Fail** | Retry logic | Toast lỗi + giữ nguyên form + giữ chỗ vẫn hoạt động |
| **Network Error** | Auto retry 3 lần | Skeleton + Toast lỗi |
| **Khách đã đăng nhập** | Check Supabase Auth | Auto-fill customer info từ profile |
| **Service không khả dụng** | Check service.is_active | Toast + remove service khỏi selection |
| **KTV nghỉ phép** | Check staff_leaves table | Không hiển thị KTV trong ngày đó |
| **Ngày lễ/Spa đóng cửa** | Check business_hours | Disable ngày trong date picker + tooltip |
| **Multi-device booking** | Session-based hold | Mỗi session chỉ 1 active hold |

---

## Tiêu chí Thành công

**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

### Kết quả có thể đo lường
| Metric | Target | Cách đo |
|--------|--------|---------|
| Conversion Rate (Hoàn tất đặt lịch) | ≥ 70% | Số booking hoàn tất / Số lượt vào Bước 1 |
| Time to Book | ≤ 2 phút | Thời gian từ Bước 1 → Success |
| Double Booking Rate | 0% | Số trường hợp trùng lịch / Tổng booking |
| Mobile Usability Score | ≥ 85/100 | Lighthouse / Manual Testing |

### Tiêu chí chấp nhận kỹ thuật
- [ ] 4 bước Wizard hoạt động end-to-end.
- [ ] Temporary Hold lock slot trong 5 phút (Supabase Realtime).
- [ ] Slot updates realtime trên tất cả clients.
- [ ] Guest Checkout không yêu cầu đăng ký.
- [ ] Responsive trên viewport 320px - 1920px.
- [ ] Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1.

### Điểm chuẩn hiệu suất
- API Response Time (OR-Tools slot calculation): ≤ 1s.
- First Contentful Paint: ≤ 1.5s.
- Time to Interactive: ≤ 3s.

---

## Ràng buộc & Giả định

**Chúng ta cần làm việc trong những giới hạn nào?**

### Ràng buộc kỹ thuật
- ✅ Next.js 16 + App Router (Server Components / Server Actions).
- ✅ Supabase (Auth, Database, Realtime).
- ✅ OR-Tools backend cho slot calculation (giả định đã có API).
- ✅ shadcn/ui + Tailwind CSS (tuân thủ Design System hiện có).
- ✅ FSD (Feature Sliced Design) - tạo feature mới tại `frontend/src/features/booking-wizard/`.
- ✅ Zustand cho state management (persist booking draft).
- ✅ React Hook Form + Zod cho form validation.

### Ràng buộc UX/UI
- ✅ Mobile-first, Thumb-friendly: Nút CTA ở bottom zone.
- ✅ Max 3 hành động chính mỗi màn hình.
- ✅ Tiếng Việt hoàn toàn.
- ✅ Premium UI: Không có giao diện "basic".

### Ràng buộc thời gian
- Target: 2-3 tuần phát triển (có thể chia phase).

### Giả định (Đã xác nhận ✅)
- [x] **Entry Point**: Landing Page CTA → redirect `/booking` page
- [x] **Platform**: Responsive (Desktop + Mobile), Mobile-first approach
- [x] **OR-Tools API**: Mock data Phase 1, integrate OR-Tools Phase 2
- [x] **Payment**: Mock COD flow trong MVP, online payment Phase 2
- [x] **Notification**: Zalo ZNS cho confirmation và reminder
- [x] **Cancel Flow**: Redirect sang Customer Dashboard để hủy
- [x] **Entity Model**: Tạo `Appointment` entity (reuse từ module appointments)
- [x] **Buffer Time**: Lấy từ `services.buffer_time` theo database design

### Giả định (Cần xác nhận)
- [ ] Service Catalog đã có dữ liệu từ module `/services`.
- [ ] Staff Profile đã có từ module `/staff`.
- [ ] Supabase Realtime đã được enable cho project.
- [ ] Customer Dashboard đã có UI để hiển thị bookings.

---

## Câu hỏi & Các mục Mở

**Các câu hỏi đã được giải quyết:**

### Câu hỏi ĐÃ TRẢ LỜI ✅

| # | Câu hỏi | Trả lời | Ngày |
|---|---------|---------|------|
| Q1 | Entry Point? | Landing Page → `/booking` page | 2025-12-13 |
| Q2 | OR-Tools Integration? | Mock data Phase 1 | 2025-12-13 |
| Q3 | Payment Method MVP? | Mock COD flow | 2025-12-13 |
| Q4 | Notification Provider? | Zalo ZNS | 2025-12-13 |
| Q5 | Cancel từ Success Screen? | Redirect sang Customer Dashboard | 2025-12-13 |
| Q6 | Platform? | Responsive (Desktop + Mobile) | 2025-12-13 |
| Q7 | Buffer Time? | Từ `services.buffer_time` | 2025-12-13 |

### Câu hỏi CÒN MỞ

| # | Câu hỏi | Ưu tiên | Owner |
|---|---------|---------|-------|
| Q8 | OTP verification cho Guest Checkout? | Medium | Product |
| Q9 | No-show policy (sau bao lâu mark no-show)? | Low | Product |
| Q10 | Rate limiting cho hold spam? (max holds/session) | Medium | Backend |

### Nghiên cứu cần thiết
- [x] ~~Xác định Payment Gateway API spec~~ → Mock COD
- [x] ~~Review OR-Tools API contract~~ → Mock data Phase 1
- [ ] Xác định Zalo ZNS template IDs cần tạo
- [ ] Benchmark Supabase Realtime performance với concurrent users

### Đầu vào từ các bên liên quan
- [x] ~~**Product Owner**: Xác nhận scope MVP~~ → Đã xác nhận
- [ ] **Backend Team**: Confirm Supabase Realtime setup
- [ ] **Design Review**: Validate wireframe theo UX research

---

## Quan Hệ Với Các Module Khác

### Module Appointments
**Booking Wizard** tạo ra **Appointment** entity, reuse data model từ module `appointments`.

| Khía cạnh | Booking Wizard (Khách hàng) | Appointments (Lễ tân) |
|-----------|-----------------------------|-----------------------|
| Người dùng | End-User (Khách hàng) | Admin/Lễ tân |
| Luồng | Wizard 4 bước | Calendar + Form |
| Tạo Entity | `Appointment` | `Appointment` |
| Real-time | Temporary Hold | Calendar refresh |
| Status ban đầu | `PENDING` | `PENDING` hoặc `CONFIRMED` |

### Module Customer Dashboard
- Hiển thị danh sách bookings của khách hàng
- Cho phép xem chi tiết và hủy booking
- Link từ Success Screen sau khi đặt lịch

### Module Services & Staff
- Reuse data từ `/services` để hiển thị danh sách dịch vụ
- Reuse data từ `/staff` để hiển thị danh sách KTV
- Tích hợp `buffer_time` từ service config

### Module Notifications (Zalo ZNS)
- Template xác nhận booking (sau khi confirm)
- Template reminder (24h và 2h trước lịch)
- Template hủy lịch (khi khách hủy)

