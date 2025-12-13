---
phase: implementation
title: Hướng dẫn Triển khai - Booking Wizard
description: Ghi chú kỹ thuật, patterns và code guidelines cho Booking Wizard
feature: booking-wizard
status: draft
created: 2025-12-13
---

# Hướng dẫn Triển khai: Booking Wizard

## Thiết lập Phát triển

**Điều kiện tiên quyết**

### Dependencies cần thiết
```bash
# Đã có sẵn trong project
- next: ^16.x
- react: ^19.x
- zustand: ^5.x
- react-hook-form: ^7.x
- zod: ^3.x
- @supabase/supabase-js: ^2.x

# Các component shadcn/ui cần dùng
- Card, Button, Badge, Input, Label
- Tabs, ScrollArea
- RadioGroup, Checkbox
- Sheet, Dialog
- Skeleton, Spinner
- Toast (Sonner)
```

### Entry Points

1. **Landing Page CTA**:
   - File: `frontend/src/features/landing-page/components/cta-section.tsx`
   - Thêm nút "Đặt Lịch Ngay" → `href="/booking"`

2. **Booking Page**:
   - Route: `/booking`
   - File: `frontend/src/app/(public)/booking/page.tsx`

---

## Cấu trúc Mã

**Mã được tổ chức như thế nào?**

### Cấu trúc thư mục FSD

```
frontend/src/features/booking-wizard/
├── index.ts                      # Public API
├── types.ts                      # TypeScript interfaces
├── schemas.ts                    # Zod validation
├── actions.ts                    # Server Actions
├── constants.ts                  # Config values
│
├── components/
│   ├── booking-wizard.tsx        # Main container
│   ├── wizard-header.tsx         # Progress + navigation
│   ├── wizard-footer.tsx         # Fixed bottom CTA
│   │
│   ├── step-services/
│   │   ├── index.ts
│   │   ├── services-step.tsx
│   │   ├── category-tabs.tsx
│   │   ├── service-list.tsx
│   │   ├── service-card.tsx
│   │   └── floating-summary.tsx
│   │
│   ├── step-technician/
│   │   ├── index.ts
│   │   ├── technician-step.tsx
│   │   ├── any-option.tsx
│   │   └── staff-list.tsx
│   │
│   ├── step-time/
│   │   ├── index.ts
│   │   ├── time-step.tsx
│   │   ├── date-picker.tsx
│   │   ├── time-slots.tsx
│   │   ├── slot-button.tsx
│   │   └── hold-timer.tsx
│   │
│   ├── step-payment/
│   │   ├── index.ts
│   │   ├── payment-step.tsx
│   │   ├── booking-summary.tsx
│   │   ├── customer-form.tsx
│   │   └── payment-methods.tsx
│   │
│   └── success/
│       └── booking-success.tsx
│
├── hooks/
│   ├── index.ts
│   ├── use-booking-store.ts      # Zustand store
│   ├── use-slot-realtime.ts      # Supabase subscription
│   └── use-hold-timer.ts         # Countdown logic
│
├── lib/
│   ├── format-price.ts           # VND formatting
│   ├── session-id.ts             # UUID management
│   └── slot-utils.ts             # Date/time helpers
│
└── data/
    └── mock-data.ts              # Mock services, staff, slots
```

### Quy ước đặt tên

| Loại | Convention | Ví dụ |
|------|------------|-------|
| Components | PascalCase | `ServiceCard`, `HoldTimer` |
| Hooks | camelCase, prefix `use` | `useBookingStore`, `useHoldTimer` |
| Actions | camelCase, verb-first | `getAvailableSlots`, `createSlotHold` |
| Types | PascalCase | `ServiceItem`, `TimeSlot` |
| Constants | SCREAMING_SNAKE | `HOLD_DURATION_MS`, `STEP_CONFIG` |
| Files | kebab-case | `booking-wizard.tsx`, `use-hold-timer.ts` |

---

## Ghi chú Triển khai

**Các chi tiết kỹ thuật chính cần nhớ**

### Tính năng 1: Zustand Store với Persist

```typescript
// hooks/use-booking-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookingState {
  // State
  currentStep: 1 | 2 | 3 | 4;
  selectedServices: ServiceItem[];
  staffId: string | 'any' | null;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  holdId: string | null;
  holdExpiresAt: Date | null;
  customerInfo: CustomerInfo | null;
  paymentMethod: 'COD' | 'ONLINE' | null;

  // Computed
  get totalPrice(): number;
  get totalDuration(): number;

  // Actions
  addService: (service: ServiceItem) => void;
  removeService: (serviceId: string) => void;
  toggleService: (service: ServiceItem) => void;
  setStaff: (staffId: string | 'any') => void;
  setSlot: (date: Date, slot: TimeSlot, holdId: string, expiresAt: Date) => void;
  clearHold: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPaymentMethod: (method: 'COD' | 'ONLINE') => void;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      selectedServices: [],
      staffId: null,
      // ... etc

      // Actions
      toggleService: (service) => set((state) => {
        const exists = state.selectedServices.find(s => s.id === service.id);
        if (exists) {
          return { selectedServices: state.selectedServices.filter(s => s.id !== service.id) };
        }
        return { selectedServices: [...state.selectedServices, service] };
      }),

      // Computed via getter
      get totalPrice() {
        return get().selectedServices.reduce((sum, s) => sum + s.price, 0);
      },
    }),
    {
      name: 'synapse-booking',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data
        selectedServices: state.selectedServices,
        staffId: state.staffId,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
```

### Tính năng 2: Session ID Management

```typescript
// lib/session-id.ts
const SESSION_KEY = 'synapse-booking-session';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}
```

### Tính năng 3: Supabase Realtime Subscription

```typescript
// hooks/use-slot-realtime.ts
import { useEffect } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useBookingStore } from './use-booking-store';

export function useSlotRealtime(staffId: string | null, date: Date | null) {
  const clearHold = useBookingStore((s) => s.clearHold);

  useEffect(() => {
    if (!staffId || !date) return;

    const supabase = createClient();
    const channel = supabase
      .channel('booking_holds')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_holds',
          filter: `staff_id=eq.${staffId}`,
        },
        (payload) => {
          // Handle new hold / released hold
          if (payload.eventType === 'INSERT') {
            // Disable slot in UI (handled via query invalidation)
          }
          if (payload.eventType === 'DELETE' || payload.new?.status === 'RELEASED') {
            // Enable slot in UI
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [staffId, date, clearHold]);
}
```

### Tính năng 4: Hold Timer Hook

```typescript
// hooks/use-hold-timer.ts
import { useState, useEffect, useCallback } from 'react';
import { useBookingStore } from './use-booking-store';
import { releaseSlotHold } from '../actions';

export function useHoldTimer() {
  const { holdId, holdExpiresAt, clearHold } = useBookingStore();
  const [remainingMs, setRemainingMs] = useState<number>(0);

  useEffect(() => {
    if (!holdExpiresAt) {
      setRemainingMs(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const expires = new Date(holdExpiresAt).getTime();
      const remaining = Math.max(0, expires - now);
      setRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const handleExpired = useCallback(async () => {
    if (holdId) {
      await releaseSlotHold(holdId);
    }
    clearHold();
    // Show modal to user
  }, [holdId, clearHold]);

  // Format for display
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  // Color coding
  const getColorClass = () => {
    if (remainingMs > 120000) return 'text-green-600'; // > 2 min
    if (remainingMs > 30000) return 'text-yellow-600'; // > 30s
    return 'text-red-600';
  };

  return {
    remainingMs,
    minutes,
    seconds,
    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    colorClass: getColorClass(),
    isExpired: remainingMs <= 0,
    isActive: !!holdExpiresAt && remainingMs > 0,
  };
}
```

---

## Các Mẫu & Thực hành Tốt nhất

### Pattern 1: Step Component Structure

Mỗi step component tuân theo cấu trúc:

```tsx
// components/step-services/services-step.tsx
'use client';

import { useBookingStore } from '../../hooks';
import { CategoryTabs } from './category-tabs';
import { ServiceList } from './service-list';
import { FloatingSummary } from './floating-summary';

export function ServicesStep() {
  const { selectedServices, totalPrice, totalDuration } = useBookingStore();

  return (
    <div className="flex flex-col h-full">
      {/* Sticky category tabs */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <CategoryTabs />
      </div>

      {/* Scrollable service list */}
      <div className="flex-1 overflow-y-auto pb-24">
        <ServiceList />
      </div>

      {/* Fixed bottom summary (only show when services selected) */}
      {selectedServices.length > 0 && (
        <FloatingSummary
          count={selectedServices.length}
          totalPrice={totalPrice}
          totalDuration={totalDuration}
        />
      )}
    </div>
  );
}
```

### Pattern 2: Server Action với Error Handling

```typescript
// actions.ts
'use server';

import { ActionResponse } from '@/shared/types';

export async function getAvailableSlots(params: {
  serviceIds: string[];
  staffId: string | 'any';
  dateStart: Date;
  dateEnd: Date;
}): Promise<ActionResponse<TimeSlot[]>> {
  try {
    // Mock implementation - replace with real API call
    const slots = await fetchSlotsFromBackend(params);

    return {
      success: true,
      data: slots,
    };
  } catch (error) {
    console.error('[getAvailableSlots]', error);
    return {
      success: false,
      error: 'Không thể tải danh sách khung giờ. Vui lòng thử lại.',
    };
  }
}
```

### Pattern 3: Responsive Layout

```tsx
// Desktop: 2-column layout
// Mobile: Full-width single column

<div className="container mx-auto px-4 py-6">
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Main content: 2/3 on desktop */}
    <div className="lg:col-span-2">
      {currentStep === 1 && <ServicesStep />}
      {currentStep === 2 && <TechnicianStep />}
      {currentStep === 3 && <TimeStep />}
      {currentStep === 4 && <PaymentStep />}
    </div>

    {/* Sidebar summary: 1/3 on desktop, hidden on mobile (use floating bar instead) */}
    <div className="hidden lg:block">
      <BookingSidebar />
    </div>
  </div>
</div>
```

---

## Điểm Tích hợp

### Integration 1: Services Module

```typescript
// Reuse existing services data
import { getServiceCategories, getServicesByCategory } from '@/features/services/actions';

// Transform for booking UI
function mapToServiceItem(service: Service): ServiceItem {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    categoryId: service.categoryId,
    categoryName: service.categoryName,
    thumbnail: service.imageUrl,
  };
}
```

### Integration 2: Staff Module

```typescript
// Reuse existing staff data
import { getActiveStaff } from '@/features/staff/actions';

// Filter by skills matching selected services
function filterStaffByServices(staff: Staff[], serviceIds: string[]): StaffItem[] {
  return staff.filter(s =>
    s.skills.some(skill => serviceIds.includes(skill))
  );
}
```

### Integration 3: Landing Page CTA

```tsx
// landing-page/components/cta-section.tsx
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

<Button asChild size="lg" className="w-full sm:w-auto">
  <Link href="/booking">
    Đặt Lịch Ngay
  </Link>
</Button>
```

---

## Xử lý Lỗi

### Chiến lược xử lý lỗi

| Lỗi | UI Response |
|-----|-------------|
| Network Error | Toast + Retry button |
| Slot unavailable | Disable slot + Toast |
| Hold expired | Modal + Return to time selection |
| Payment failed | Toast + Keep form data |
| Validation error | Inline error messages |

### Toast Messages

```typescript
// Sử dụng Sonner toast
import { toast } from 'sonner';

// Success
toast.success('Đã giữ chỗ thành công!');

// Error
toast.error('Không thể giữ chỗ. Khung giờ này vừa được đặt.');

// Warning
toast.warning('Thời gian giữ chỗ sắp hết!', {
  description: 'Còn 1 phút để hoàn tất đặt lịch.',
});
```

---

## Cân nhắc Hiệu suất

### Tối ưu hóa

1. **Service List Virtualization**: Dùng `react-virtual` nếu danh sách > 50 items
2. **Image Optimization**: Next.js `<Image>` với blur placeholder
3. **Slot Calculation Caching**: Cache kết quả theo key `${date}-${staffId}-${duration}`
4. **Debounce Search**: 300ms debounce cho search input

### Bundle Size

```typescript
// Dynamic import cho heavy components
const TimeSlots = dynamic(() => import('./time-slots'), {
  loading: () => <SlotsSkeleton />,
});
```

---

## Ghi chú Bảo mật

### Checklist

- [ ] Session ID là UUID v4, không chứa thông tin nhạy cảm
- [ ] Không expose user data trong localStorage
- [ ] Validate phone format trước khi submit
- [ ] Rate limiting: Max 3 active holds per session
- [ ] OTP verification cho high-value bookings (optional, post-MVP)

### Input Validation

```typescript
// schemas.ts
import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});
```

