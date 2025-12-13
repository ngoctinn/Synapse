# BÁO CÁO ĐÁNH GIÁ UX CHUYÊN SÂU: TÍNH NĂNG QUẢN LÝ LỊCH HẸN

**Ngày đánh giá**: 2025-12-13
**Tính năng**: Appointments Module (`frontend/src/features/appointments`)
**Người dùng mục tiêu**: Lễ tân, Quản lý Spa (mức hiểu biết công nghệ trung bình)
**Phương pháp**: Phân tích code-based, User Flow Mapping, Heuristic Evaluation

---

## TÓM TẮT ĐIỀU HÀNH

| Tiêu chí | Điểm (1-10) | Đánh giá |
|----------|-------------|----------|
| **Độ trực quan (Discoverability)** | 7/10 | Khá tốt, một số tính năng ẩn |
| **Tính dễ hiểu (Learnability)** | 6.5/10 | Cần cải thiện guidance |
| **Độ mượt (Flow Efficiency)** | 6/10 | Có friction đáng kể |
| **Phản hồi giao diện (Feedback)** | 7.5/10 | Toast tốt, loading states ổn |
| **Ngăn ngừa lỗi (Error Prevention)** | 5.5/10 | Thiếu validation real-time |
| **Khả năng phục hồi (Recovery)** | 6/10 | Dialog confirm cơ bản |

**Tổng điểm UX**: **6.4/10** - Cần cải thiện đáng kể

---

## PHẦN I: PHÂN TÍCH LUỒNG NGƯỜI DÙNG (USER FLOWS)

### 1.1 Luồng Chính: Tạo Lịch Hẹn Mới

```
[Bước 1] Click "Đặt lịch" →
[Bước 2] Sheet mở ra →
[Bước 3] Tìm khách hàng (Combobox) →
[Bước 4] Chọn dịch vụ (MultiSelect) →
[Bước 5] Chọn KTV →
[Bước 6] Chọn ngày/giờ →
[Bước 7] (Optional) Chọn phòng →
[Bước 8] Click "Tạo lịch hẹn"
```

#### ⚠️ VẤN ĐỀ PHÁT HIỆN:

| # | Vấn đề | Mức độ | Bước |
|---|--------|--------|------|
| 1.1.1 | **Không có tìm khách nhanh trước khi mở form** | Trung bình | 2→3 |
| 1.1.2 | **Combobox yêu cầu 2 ký tự mới tìm** - Thông báo "Nhập 2 ký tự để tìm..." khiến người dùng phải đợi | Cao | 3 |
| 1.1.3 | **Không hiển thị lịch sử gần đây** của khách hàng đã đặt | Trung bình | 3 |
| 1.1.4 | **Không có gợi ý khung giờ trống** dựa trên KTV đã chọn | Cao | 6 |
| 1.1.5 | **Thiếu conflict checking real-time** khi chọn giờ | Nghiêm trọng | 6 |
| 1.1.6 | **Scroll Time Slots** - 57 options từ 08:00→21:00 (mỗi 15 phút) gây khó chọn | Trung bình | 6 |

#### 📊 PHÂN TÍCH CHI TIẾT:

**Bước 3 - Tìm khách hàng:**
```
Hiện tại: Gõ ít nhất 2 ký tự → Đợi 300ms debounce → Kết quả hiển thị
Kỳ vọng: Gõ 1 ký tự hoặc hiển thị "Khách gần đây" ngay khi focus
```
- **Friction**: 1 thao tác thừa (phải đợi feedback)
- **Đề xuất**: Hiển thị 5 khách hàng gần nhất khi mở Combobox

**Bước 6 - Chọn giờ:**
```tsx
// Hiện tại: Select dropdown với 57 options
TIME_SLOTS = generateTimeSlots(); // 08:00 → 21:00, step 15 phút
```
- **Vấn đề**: Không có visual indication giờ nào đã bận
- **Đề xuất**: Sử dụng TimePicker visual hoặc highlight available slots

---

### 1.2 Luồng: Check-in Khách Hàng

```
[Bước 1] Tìm event trên calendar →
[Bước 2] Click event →
[Bước 3] Popover xuất hiện →
[Bước 4] Click "Check-in"
```

#### ✅ ĐIỂM MẠNH:
- **Context-aware actions**: Nút Check-in chỉ hiện khi trong khoảng thời gian hợp lệ (15 phút trước → 30 phút sau)
- **Visual prominent**: Nút Check-in có màu emerald-600, nổi bật

```tsx
// Điều kiện hiển thị nút Check-in (tốt):
const canCheckIn =
  event.status === "confirmed" &&
  minutesUntilStart <= 15 &&
  minutesSinceStart <= 30;
```

#### ⚠️ VẤN ĐỀ:

| # | Vấn đề | Mức độ |
|---|--------|--------|
| 1.2.1 | **Không có countdown/timer** cho người dùng biết còn bao lâu có thể check-in | Thấp |
| 1.2.2 | **Không có batch check-in** cho nhiều khách đến cùng lúc | Trung bình |
| 1.2.3 | **Click 2 lần** để check-in (click event → click button) | Trung bình |

---

### 1.3 Luồng: Hủy Lịch Hẹn

```
[Bước 1] Click event →
[Bước 2] Click "Hủy lịch" trong popover/sheet →
[Bước 3] Dialog xác nhận mở →
[Bước 4] Nhập lý do (tùy chọn) →
[Bước 5] Click "Xác nhận hủy"
```

#### ✅ ĐIỂM MẠNH:
- **Cancellation Policy Display** rõ ràng (2 giờ trước miễn phí, trong 2 giờ phí 50%)
- **Late Cancel Warning** với màu amber highlight
- **Reason Input** optional, không bắt buộc

```tsx
// Cảnh báo hủy sát giờ (tốt):
{isLateCancel && (
  <div className="bg-amber-50 border-amber-200">
    Cảnh báo: Hủy sát giờ - còn {hoursUntilStart} giờ
  </div>
)}
```

#### ⚠️ VẤN ĐỀ:

| # | Vấn đề | Mức độ |
|---|--------|--------|
| 1.3.1 | **Thiếu confirmation SMS/notification option** cho khách | Trung bình |
| 1.3.2 | **Không hiển thị phí hủy cụ thể** (chỉ nói 50%, không tính số tiền) | Cao |
| 1.3.3 | **Dùng native confirm() ở một số nơi** thay vì CancelDialog | Nghiêm trọng |

**Dẫn chứng code (vấn đề 1.3.3):**
```tsx
// appointments-page.tsx line 218-223
const handleCancel = useCallback(async (event: CalendarEvent) => {
  // ❌ Dùng native confirm() - không consistent
  if (!confirm(message)) return;
  ...
});
```

---

### 1.4 Luồng: Xem Lịch Theo Các Chế Độ View

**Các chế độ có sẵn:** Day | Week | Month | Agenda | Timeline

#### ✅ ĐIỂM MẠNH:
- **5 view modes** đáp ứng nhiều use case
- **Icon-only tabs** tiết kiệm không gian
- **Keyboard shortcuts** được định nghĩa (d, w, m, a)

#### ⚠️ VẤN ĐỀ:

| # | Vấn đề | Mức độ |
|---|--------|--------|
| 1.4.1 | **Không có label text** cho view tabs - chỉ icon, khó cho người mới | Trung bình |
| 1.4.2 | **Không có tooltip delay** khi hover icon | Thấp |
| 1.4.3 | **Keyboard shortcuts không được hiển thị** trong UI | Trung bình |
| 1.4.4 | **Timeline view** thiếu trong navigation flow hiện tại | Cao |

```tsx
// Hiện tại: Icon-only
<TabsTrigger value={view} className="w-8 h-7">
  {VIEW_ICONS[view]}
  <span className="sr-only">{CALENDAR_VIEW_CONFIG[view].label}</span>
</TabsTrigger>
```

**Đề xuất**: Hiển thị label trên desktop, icon-only trên mobile.

---

## PHẦN II: ĐÁNH GIÁ HEURISTIC (10 NGUYÊN TẮC NIELSEN)

### 2.1 Visibility of System Status ⭐⭐⭐⭐ (7/10)

**Tốt:**
- Loading states với `isPending` và spinner tốt
- Toast notifications cho actions (check-in, cancel, etc.)
- Metrics badges hiển thị realtime (Total, Pending, Occupancy)

**Cần cải thiện:**
- Không có progress indicator khi tìm kiếm khách hàng (chỉ có loading text)
- Không có skeleton loading cho calendar grid khi đổi tuần/tháng

---

### 2.2 Match Between System and Real World ⭐⭐⭐⭐ (8/10)

**Tốt:**
- Thuật ngữ Tiếng Việt chuẩn: "Đặt lịch", "Kỹ thuật viên", "Check-in"
- Status labels phù hợp: "Chờ xác nhận", "Đang thực hiện"
- Calendar metaphor quen thuộc

**Cần cải thiện:**
- "No-show" vẫn dùng tiếng Anh (nên là "Khách vắng mặt" hoặc "Không đến")

---

### 2.3 User Control and Freedom ⭐⭐⭐ (6/10)

**Tốt:**
- Sheet có nút "Hủy bỏ" rõ ràng
- "Quay lại" trong Cancel Dialog

**Cần cải thiện:**
- **Không có Undo** sau khi hủy/xóa lịch hẹn
- **Không có Draft saving** khi đang tạo lịch hẹn dở
- Edit mode không có "Hoàn tác thay đổi" (chỉ có Hủy bỏ = mất hết)

---

### 2.4 Consistency and Standards ⭐⭐⭐ (6/10)

**Vấn đề nghiêm trọng:**

| # | Vấn đề |
|---|--------|
| 1 | **Confirm patterns không nhất quán**: Có nơi dùng native `confirm()`, có nơi dùng `CancelDialog` |
| 2 | **Action buttons trong Sheet vs Popover** có màu/size khác nhau |
| 3 | **Form error display** không thống nhất giữa các fields |

**Dẫn chứng:**
```tsx
// appointments-page.tsx - Dùng native confirm
if (!confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;

// cancel-dialog.tsx - Dùng custom Dialog
<CancelDialog event={event} open={open} ... />
```

---

### 2.5 Error Prevention ⭐⭐ (5/10)

**Thiếu sót nghiêm trọng:**

| # | Vấn đề | Impact |
|---|--------|--------|
| 1 | **Không kiểm tra conflict real-time** khi chọn thời gian | Cao |
| 2 | **Không validate KTV availability** trước khi submit | Cao |
| 3 | **Cho phép đặt lịch trong quá khứ** (minDate chỉ check ngày, không check giờ) | Trung bình |
| 4 | **Không warning khi đặt ngoài giờ làm việc** (trước 8h hoặc sau 21h) | Trung bình |

**Mã liên quan:**
```tsx
// appointment-form.tsx line 337
<DatePicker
  minDate={new Date()} // ✓ Check ngày
  // ❌ Không check giờ - có thể đặt 22:00 hôm nay
/>
```

---

### 2.6 Recognition Rather Than Recall ⭐⭐⭐⭐ (7/10)

**Tốt:**
- Staff dropdown hiển thị màu indicator
- Service color coding trên calendar events
- Status badges với màu semantic (amber, emerald, red)

**Cần cải thiện:**
- Customer field không hiển thị recent customers
- Không có "Đặt lại" (Repeat booking) cho lịch hẹn định kỳ

---

### 2.7 Flexibility and Efficiency of Use ⭐⭐⭐ (6/10)

**Tốt:**
- Keyboard shortcuts được định nghĩa (nhưng không hoạt động/hiển thị)
- Quick slot click để tạo lịch nhanh

**Cần cải thiện:**
- **Không có Quick Create** inline trên calendar
- **Không có Drag-to-reschedule**
- **Không có Copy/Duplicate appointment**
- **Filter chưa fully implemented** (nút Filter không làm gì)

```tsx
// appointments-page.tsx line 385-391
<Button variant="ghost" size="icon" ...>
  <Filter className="h-4 w-4" />
  {/* ❌ Không có onClick handler, không làm gì */}
</Button>
```

---

### 2.8 Aesthetic and Minimalist Design ⭐⭐⭐⭐ (7.5/10)

**Tốt:**
- Clean layout với surface cards
- Color coding consistent (status colors)
- Sheet layout spacious, dễ đọc

**Cần cải thiện:**
- Footer có quá nhiều buttons (Check-in, Hủy, Đóng, Chỉnh sửa) - information overload
- Popover header có màu service + status badge có thể hơi rối

---

### 2.9 Help Users Recognize, Diagnose, and Recover From Errors ⭐⭐ (5/10)

**Thiếu sót:**
- Form errors hiển thị nhưng không có suggestions
- Không có inline validation hints
- API errors chỉ hiển thị message chung, không có recovery path

```tsx
// Chỉ show message, không hướng dẫn fix
showToast.error(result.message || "Không thể check-in");
```

---

### 2.10 Help and Documentation ⭐⭐ (4/10)

**Thiếu hoàn toàn:**
- Không có onboarding/tour cho người dùng mới
- Không có help tooltips giải thích các tính năng
- Không có keyboard shortcut cheat sheet
- Settings button không có chức năng

---

## PHẦN III: MA SÁT VÀ CƠ HỘI TỐI ƯU (FRICTION ANALYSIS)

### 3.1 Tạo Lịch Hẹn Mới

| Metric | Hiện tại | Mục tiêu | Cải thiện |
|--------|----------|----------|-----------|
| **Số click tối thiểu** | 8 clicks | 5 clicks | -37% |
| **Thời gian hoàn thành** | ~45 giây | ~25 giây | -44% |
| **Form fields** | 7 fields | 4 required + 3 optional | Clarity |

**Đề xuất:**
1. **Quick Booking Mode**: Customer + Service + Date/Time only (3 fields)
2. **Smart Defaults**: Auto-select staff based on service skill
3. **Inline time slots**: Visual picker thay vì dropdown

---

### 3.2 Check-in Workflow

| Metric | Hiện tại | Mục tiêu |
|--------|----------|----------|
| **Click path** | Find → Click → Popover → Check-in | Find → Swipe/Long-press |
| **Batch capability** | No | Yes (select multiple) |

---

### 3.3 Navigation Between Views

| Metric | Hiện tại | Mục tiêu |
|--------|----------|----------|
| **View switch** | Click tabs | Swipe gestures (mobile) |
| **Date navigation** | Arrows only | Mini calendar picker |

---

## PHẦN IV: KHUYẾN NGHỊ CẢI THIỆN

### 🔴 Ưu tiên Cao (P0) - Ảnh hưởng trực tiếp đến hiệu suất công việc

| # | Khuyến nghị | Effort | Impact |
|---|-------------|--------|--------|
| 1 | **Thêm conflict checking real-time** khi chọn thời gian | Medium | High |
| 2 | **Thay thế native confirm() bằng ConfirmDialog** | Low | High |
| 3 | **Implement Filter functionality** (đang là nút rỗng) | Medium | High |
| 4 | **Hiển thị available slots** dựa trên Staff selected | High | High |

---

### 🟠 Ưu tiên Trung bình (P1) - Cải thiện UX đáng kể

| # | Khuyến nghị | Effort | Impact |
|---|-------------|--------|--------|
| 5 | **Thêm Recent Customers** vào Combobox | Low | Medium |
| 6 | **Visual Time Picker** thay vì Select dropdown | Medium | Medium |
| 7 | **Thêm label text cho View tabs** (desktop) | Low | Medium |
| 8 | **Tính toán và hiển thị phí hủy cụ thể** (số tiền) | Low | Medium |
| 9 | **Batch check-in** cho nhiều guests | Medium | Medium |

---

### 🟢 Ưu tiên Thấp (P2) - Nice-to-have

| # | Khuyến nghị | Effort | Impact |
|---|-------------|--------|--------|
| 10 | Keyboard shortcuts indicator | Low | Low |
| 11 | Onboarding tour | Medium | Low |
| 12 | Undo after cancel/delete | High | Low |
| 13 | Drag-to-reschedule | High | Medium |
| 14 | Mini calendar picker for navigation | Medium | Low |

---

## PHẦN V: METRICS VÀ THƯỚC ĐO SUCCESS

### KPIs Đề Xuất Theo Dõi

| Metric | Baseline (Ước tính) | Target |
|--------|---------------------|--------|
| **Task Completion Rate** (Tạo lịch) | 85% | 95% |
| **Time to Create Appointment** | 45s | 25s |
| **Error Rate** (Double booking) | 5% | <1% |
| **Check-in Click Count** | 3 | 2 |
| **Filter Usage Rate** | 0% (broken) | 40% |

---

## PHẦN VI: KẾT LUẬN

### Điểm Mạnh Hiện Tại
1. ✅ Giao diện calendar views đa dạng và linh hoạt
2. ✅ Status management với color coding tốt
3. ✅ Cancellation policy display chuyên nghiệp
4. ✅ Context-aware actions (Check-in chỉ hiện đúng thời điểm)
5. ✅ Responsive design considerations

### Điểm Yếu Cần Khắc Phục
1. ❌ Thiếu conflict prevention khi đặt lịch
2. ❌ UX không nhất quán (native confirm vs custom dialog)
3. ❌ Filter và Settings không hoạt động
4. ❌ Thiếu guidance cho người dùng mới
5. ❌ Quá nhiều clicks cho các tác vụ phổ biến

### Đánh Giá Tổng Thể

Tính năng Quản lý Lịch hẹn có nền tảng tốt với UI hiện đại và các features cơ bản hoạt động. Tuy nhiên, để đạt được trải nghiệm "Premium Spa" như mục tiêu dự án, cần tập trung vào:

1. **Error prevention** - Ngăn chặn double booking
2. **Consistency** - Thống nhất patterns xác nhận
3. **Efficiency** - Giảm số thao tác cho tasks thường xuyên
4. **Completeness** - Hoàn thiện các tính năng đang "rỗng" (Filter, Settings)

---

*Báo cáo được tạo bởi UX Feature Analyst*
*Phương pháp: Code-based Analysis + Nielsen Heuristics*
