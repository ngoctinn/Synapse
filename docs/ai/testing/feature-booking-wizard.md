---
phase: testing
title: Chiến lược Kiểm thử - Booking Wizard
description: Test cases và QA checklist cho tính năng Booking Wizard
feature: booking-wizard
status: draft
created: 2025-12-13
---

# Chiến lược Kiểm thử: Booking Wizard

## Mục tiêu Độ bao phủ Kiểm thử

| Loại Test | Target Coverage | Notes |
|-----------|-----------------|-------|
| Unit Tests | 80%+ | Hooks, utils, store actions |
| Integration Tests | Critical paths | Full wizard flow |
| E2E Tests | Happy path + Edge cases | Core user journeys |
| Manual Testing | UI/UX, Mobile, A11y | Human-verified |

---

## Kiểm thử Đơn vị

### Module: Zustand Store (`use-booking-store.ts`)

- [ ] **TC-001**: `addService` thêm service vào array
- [ ] **TC-002**: `addService` không duplicate nếu service đã tồn tại
- [ ] **TC-003**: `removeService` xóa đúng service theo ID
- [ ] **TC-004**: `toggleService` toggle on/off correctly
- [ ] **TC-005**: `totalPrice` computed đúng khi có nhiều services
- [ ] **TC-006**: `totalDuration` computed đúng
- [ ] **TC-007**: `setStaff` với 'any' value
- [ ] **TC-008**: `setSlot` lưu đúng holdId và expiresAt
- [ ] **TC-009**: `clearHold` reset hold state về null
- [ ] **TC-010**: `reset` reset toàn bộ state về initial
- [ ] **TC-011**: `goToStep` chỉ cho phép step 1-4
- [ ] **TC-012**: `nextStep` không vượt quá step 4
- [ ] **TC-013**: `prevStep` không dưới step 1
- [ ] **TC-014**: Persist middleware lưu/khôi phục đúng data

### Module: Hold Timer Hook (`use-hold-timer.ts`)

- [ ] **TC-015**: Countdown giảm đúng mỗi giây
- [ ] **TC-016**: `remainingMs` = 0 khi hết thời gian
- [ ] **TC-017**: `isExpired` = true khi countdown về 0
- [ ] **TC-018**: Color class chuyển từ green → yellow → red đúng threshold
- [ ] **TC-019**: `formatted` output đúng format "mm:ss"
- [ ] **TC-020**: Callback `onExpired` được gọi khi hết thời gian

### Module: Session ID (`session-id.ts`)

- [ ] **TC-021**: `getSessionId` trả về UUID format hợp lệ
- [ ] **TC-022**: `getSessionId` trả về cùng ID khi gọi nhiều lần
- [ ] **TC-023**: `clearSessionId` xóa khỏi localStorage
- [ ] **TC-024**: Tạo ID mới sau khi clear

### Module: Format Utils (`format-price.ts`)

- [ ] **TC-025**: Format 1000000 → "1.000.000 ₫"
- [ ] **TC-026**: Format 0 → "0 ₫"
- [ ] **TC-027**: Format với decimal bị làm tròn

### Module: Schemas (`schemas.ts`)

- [ ] **TC-028**: `customerInfoSchema` validate phone hợp lệ
- [ ] **TC-029**: `customerInfoSchema` reject phone không hợp lệ
- [ ] **TC-030**: `customerInfoSchema` validate email format
- [ ] **TC-031**: `customerInfoSchema` accept email rỗng (optional)

---

## Kiểm thử Tích hợp

### Flow: Complete Booking (Happy Path)

```gherkin
Feature: Complete Booking Flow

Scenario: Customer books a service successfully
  Given I am on the booking page
  When I select "Massage Thư Giãn" service
  And I click "Tiếp tục"
  And I select "Bất kỳ KTV" option
  And I click "Tiếp tục"
  And I select tomorrow's date
  And I select "10:00" time slot
  Then I should see countdown timer
  When I fill customer name "Nguyễn Văn A"
  And I fill phone "0901234567"
  And I select payment method "Thanh toán tại quầy"
  And I click "Xác Nhận Đặt Lịch"
  Then I should see success screen
  And I should see confirmation code
```

### Flow: Slot Hold Expiration

```gherkin
Scenario: Hold expires during booking
  Given I have selected a time slot
  And countdown shows "0:30"
  When I wait 30 seconds without action
  Then I should see expiration modal
  And the slot should be released
  When I click "Chọn lại khung giờ"
  Then I should return to Step 3
```

### Flow: Concurrent User Conflict

```gherkin
Scenario: Another user books the same slot
  Given User A is viewing slot "10:00"
  And User B selects slot "10:00" first
  When Supabase broadcasts hold event
  Then User A should see slot "10:00" disabled
  And User A should see toast "Khung giờ vừa được giữ"
```

### Server Actions Tests

- [ ] **IT-001**: `getServicesForBooking` returns grouped services
- [ ] **IT-002**: `getAvailableStaff` filters by service skills
- [ ] **IT-003**: `getAvailableSlots` returns correct slots for date range
- [ ] **IT-004**: `createSlotHold` creates hold in database
- [ ] **IT-005**: `createSlotHold` returns error if slot already held
- [ ] **IT-006**: `releaseSlotHold` updates status to RELEASED
- [ ] **IT-007**: `confirmBooking` converts hold to booking
- [ ] **IT-008**: `confirmBooking` creates booking_items records

---

## Kiểm thử Đầu cuối (E2E)

### User Journey 1: First-time Customer

- [ ] **E2E-001**: Navigate from Landing Page → Booking
- [ ] **E2E-002**: Browse services by category
- [ ] **E2E-003**: Multi-select services
- [ ] **E2E-004**: Complete 4-step flow
- [ ] **E2E-005**: Return to homepage after success

### User Journey 2: Returning Customer

- [ ] **E2E-006**: Resume abandoned booking (localStorage)
- [ ] **E2E-007**: Pre-filled customer info

### User Journey 3: Mobile User

- [ ] **E2E-008**: Complete flow on 375px viewport
- [ ] **E2E-009**: Floating summary visible and tappable
- [ ] **E2E-010**: Bottom CTA always accessible

---

## Dữ liệu Kiểm thử

### Mock Data Files

```typescript
// data/mock-data.ts

export const mockServices: ServiceItem[] = [
  {
    id: 'svc-1',
    name: 'Massage Thư Giãn',
    description: 'Massage toàn thân với tinh dầu',
    price: 500000,
    duration: 60,
    categoryId: 'cat-massage',
    categoryName: 'Massage',
    thumbnail: '/placeholder/massage.jpg',
  },
  // ... more services
];

export const mockStaff: StaffItem[] = [
  {
    id: 'staff-1',
    name: 'Nguyễn Thị Hoa',
    avatar: '/placeholder/avatar.jpg',
    rating: 4.8,
    skills: ['svc-1', 'svc-2'],
    isAvailableToday: true,
  },
  // ... more staff
];

export const mockSlots: TimeSlot[] = [
  { time: '09:00', isAvailable: true, isHeld: false },
  { time: '09:30', isAvailable: true, isHeld: false },
  { time: '10:00', isAvailable: true, isHeld: true, heldBy: 'other-session' },
  // ... more slots
];
```

### Test Database Setup

```sql
-- Seed test data
INSERT INTO services (id, name, duration, price) VALUES
  ('test-svc-1', 'Test Service', 60, 100000);

INSERT INTO staff (id, full_name, skills) VALUES
  ('test-staff-1', 'Test Staff', ARRAY['test-svc-1']);
```

---

## Kiểm thử Thủ công

### UI/UX Checklist

#### Step 1: Services

- [ ] Category tabs scroll horizontally on mobile
- [ ] Service cards show price, duration, thumbnail
- [ ] Selected services have visual distinction
- [ ] Floating summary appears when services > 0
- [ ] Total price and duration update correctly
- [ ] "Tiếp tục" button disabled when no selection

#### Step 2: Technician

- [ ] "Bất kỳ KTV" option is prominent (first position)
- [ ] Staff cards show avatar, name, rating
- [ ] "Có chỗ hôm nay" badge visible for available staff
- [ ] Single selection (radio behavior)

#### Step 3: Time

- [ ] Date picker shows 7 days ahead
- [ ] Selected date is highlighted
- [ ] Slots grouped by Sáng/Chiều/Tối
- [ ] Available slots are tappable
- [ ] Held slots (by others) are disabled
- [ ] Selected slot triggers hold
- [ ] Countdown timer visible after selection
- [ ] Timer color changes at thresholds

#### Step 4: Payment

- [ ] Booking summary shows all details
- [ ] Customer form validates inputs
- [ ] Phone validation works correctly
- [ ] Payment methods are radio selection
- [ ] "Xác nhận" button disabled until form valid

#### Success Screen

- [ ] Confirmation code displayed prominently
- [ ] Booking details summary
- [ ] CTA buttons work correctly

### Mobile Testing Checklist

| Device | Viewport | Status |
|--------|----------|--------|
| iPhone SE | 375x667 | ⬜ |
| iPhone 14 | 390x844 | ⬜ |
| Pixel 7 | 412x915 | ⬜ |
| Galaxy S21 | 360x800 | ⬜ |
| iPad Mini | 768x1024 | ⬜ |

### Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Tab order is logical
- [ ] ARIA labels on custom components
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announces step transitions
- [ ] Error messages are associated with inputs

---

## Kiểm thử Hiệu suất

### Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| LCP | ≤ 2.5s | Lighthouse |
| FID | ≤ 100ms | Lighthouse |
| CLS | ≤ 0.1 | Lighthouse |
| Time to Interactive | ≤ 3s | Lighthouse |
| Bundle Size | ≤ 100KB (feature JS) | Webpack Analyzer |

### Load Testing Scenarios

- [ ] 10 concurrent users selecting same time slot
- [ ] 50 concurrent realtime subscriptions
- [ ] Slot calculation with 100+ services

---

## Theo dõi Lỗi

### Bug Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| P0 - Critical | Booking cannot complete | Same day fix |
| P1 - High | Major flow blocked | 1-2 days |
| P2 - Medium | Workaround available | 3-5 days |
| P3 - Low | Minor UI issue | Backlog |

### Known Issues Template

```markdown
## BUG-XXX: [Title]
- **Severity**: P0/P1/P2/P3
- **Steps to Reproduce**:
- **Expected Behavior**:
- **Actual Behavior**:
- **Device/Browser**:
- **Screenshot**:
```

### Regression Test Cases

Sau mỗi fix, chạy lại:
- [ ] Complete booking flow (Happy path)
- [ ] Hold expiration flow
- [ ] Concurrent user scenario

