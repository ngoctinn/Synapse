---
description: Milestone M4 - Appointments Workflows (4 ngày)
---

# 🟠 M4: Appointments Workflows (4 ngày)

## Issues: H1, H6, H7
## Tham khảo: `docs/ai/requirements/feature-appointments-completion.md`

---

### Task 4.1: Walk-in Booking (H7)

**Mục tiêu:** Lễ tân có thể tạo nhanh lịch cho khách vãng lai.

**Làm gì:**
1. Tạo walk-in-booking-dialog với form tối giản
2. Status mặc định = "in_progress", time = now
3. Thêm button "Tạo nhanh" vào toolbar
4. Tham khảo US-A3 trong requirements

---

### Task 4.2: Check-in & No-show (H6)

**Mục tiêu:** Actions check-in và no-show hoạt động.

**Làm gì:**
1. Thêm button Check-in (visible khi confirmed)
2. Thêm button No-show (visible khi confirmed + quá 15 phút)
3. Connect với existing actions
4. Tham khảo US-A4, US-A5 trong requirements

---

### Task 4.3: Cancel Booking (H1)

**Mục tiêu:** Hủy lịch với policy (warning < 2h).

**Làm gì:**
1. Tạo cancel dialog với input lý do
2. Warning nếu hủy < 2 giờ trước hẹn
3. Thêm vào EventPopover và customer-dashboard
4. Tham khảo US-A6 trong requirements

---

### Verify
- Walk-in tạo thành công
- Check-in/No-show hoạt động
- Cancel với policy warning
- Update Issue Tracker: H1, H6, H7 = DONE

## Tiếp theo
→ `/06-m5-billing-reviews`
