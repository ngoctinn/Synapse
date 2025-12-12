# Frontend Refactor Plan: Appointments Module (M3)

## 1. Executive Summary
Refactor the Appointments module from a basic MVP state to a production-grade system that supports complex "Spa" business logic. This includes migrating from single-service to multi-service bookings, implementing intelligent constraint-based scheduling (Smart Scheduling), and integrating fluid workflows for Walk-in customers and efficient Checkout. The refactor focuses solely on frontend architecture, ensuring seamless data contracts with the modular monolith backend.

## 2. Audit: QA & UX Gap Analysis
| ID | Feature | Current State (MVP) | Desired State (Production) | Backend Mismatch |
|----|---------|---------------------|----------------------------|------------------|
| **UX-01** | **Service Selection** | Single `<Select>` used. | Multi-select with ordered items (e.g., Wash + Cut + Style). | DB stores `booking_items` (1:N), frontend assumes 1:1. |
| **UX-02** | **Walk-in Flow** | Must leave form to create customer. | "Quick Create" inline dialog or Combobox action. | Backend capable of `get_or_create`, frontend lacks UI. |
| **UX-03** | **Resource Logic** | Free selection of any resource. | Filtered by Service requirements (e.g., Massage -> needs Room). | Missing context-aware filtering based on `service_resource_requirements`. |
| **UX-04** | **Availability** | Reactive check (Error on submit). | Proactive "Smart Slots" preview based on Duration/Staff. | Frontend doesn't utilize `AvailabilitySolver` API for suggestions. |
| **UX-05** | **Checkout** | Hidden "Toast" notification. | `PaymentDialog` with amount confirmation & breakdown. | Invoice generation exists but UI is invisible. |
| **UX-06** | **Validation** | Basic HTML5/Zod constraints. | Cross-field logic (End > Start, Staff has Skill). | Logic exists in BE Service, missing in FE Client validation. |

## 3. Proposed Architecture & UI/UX

### 3.1. Core Component: `BookingWizard`
Replacing the flat `AppointmentForm` with a step-based or sectional Wizard to manage complexity.

**Structure:**
```tsx
<BookingWizard>
  <WizardSteps>
    <Step1_Customer>
       <CustomerSearch />
       {/* Triggers WalkInDialog if not found */}
    </Step1_Customer>
    <Step2_Services>
       <MultiServiceSelector />
       {/* Calculates Total Duration & Price */}
    </Step2_Services>
    <Step3_Schedule>
       <SmartTimeSlotPicker />
       {/* Uses AvailabilitySolver */}
    </Step3_Schedule>
    <Step4_Resources>
       <ResourceAllocator />
       {/* Filtered by Service requirements */}
    </Step4_Resources>
    <Step5_Review>
       <BookingSummary />
    </Step5_Review>
  </WizardSteps>
</BookingWizard>
```

### 3.2. New Key Components

#### `MultiServiceSelector`
*   **Props**: `value: Service[]`, `onChange: (services: Service[]) => void`
*   **Behavior**: Allows adding multiple services. Displays total duration and estimated price. Replaces the single `Select`.

#### `SmartTimeSlotPicker`
*   **Props**: `date: Date`, `duration: number`, `staffId?: string`, `onSelect: (time: Date) => void`
*   **Behavior**: Calls `getAvailableSlots` API. Renders a grid of time slots. Disables slots conflicting with `staff_schedules`.

#### `WalkInCustomerDialog`
*   **Trigger**: "Create new customer" option in Combobox.
*   **Fields**: Name, Phone (Required).
*   **Action**: Calls `createWalkInCustomer` (Optimistic UI).

#### `PaymentDialog`
*   **Props**: `booking: Appointment`, `onComplete: () => void`.
*   **UI**: Invoice preview, Payment Method (Cash/Card/Transfer), Print button.

## 4. Logical Data Model (Frontend Types)

We need to update `frontend/src/features/appointments/types.ts` to reflect the 1-to-Many structure.

```typescript
// Proposed Type Changes
export interface BookingItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  startTime?: Date; // Logic for sequential items
  staffId?: string; // If allowing different staff per service
}

export interface Appointment {
  id: string;
  customerId: string;
  // ...customer details

  // REPLACES root-level serviceId
  items: BookingItem[];

  totalPrice: number;
  totalDuration: number;

  // ...status, timestamps
}
```

## 5. Adapter Layer (Backend Compatibility)

Since the Backend API (via `database_design.md`) returns `booking_items` but our current MVP frontend might need gradual migration, we use an Adapter.

**File:** `src/features/appointments/adapters.ts`

```typescript
import { Appointment, BookingItem } from "./types";

// Transform Backend Response -> Frontend Model
export function toAppointmentUI(apiResponse: any): Appointment {
  return {
    ...apiResponse,
    items: apiResponse.booking_items.map((item: any) => ({
      serviceId: item.service_id,
      serviceName: item.service_name_snapshot,
      price: item.original_price,
      duration: calculateDuration(item.start_time, item.end_time),
    })),
    // ...map other fields
  };
}

// Transform Frontend Form -> Create Booking Payload
export function toBookingPayload(formData: AppointmentFormData) {
  return {
    customer_id: formData.customerId,
    items: formData.services.map(s => ({
        service_id: s.id,
        // ...
    })),
    start_time: formData.startTime.toISOString(),
    // ...
  };
}
```

## 6. Migration Plan

### Phase 1: Foundation & Types (Feature Flag: `ENABLE_V2_BOOKING`)
- [ ] Refactor `types.ts` to support `items: BookingItem[]`.
- [ ] Create `adapters.ts` to bridge current Mock/API to new types.
- [ ] Update `schemas.ts` for Zod validation of array-based services.

### Phase 2: Component Refactor
- [ ] Create `MultiServiceSelector` (isolated component).
- [ ] Create `SmartTimeSlotPicker` (mocking the Solver initially).
- [ ] Create `WalkInBookingDialog`.

### Phase 3: Integration (Wizard)
- [ ] Build `BookingWizard` container.
- [ ] Connect `BookingWizard` to `AppointmentSheet`.
- [ ] Integrate `PaymentDialog` into the "Complete" status transition.

### Phase 4: Clean Up
- [ ] Remove legacy `ServiceSelect`.
- [ ] Remove `quickAppointmentFormSchema` (consolidate).

## 7. Testing Strategy

| Type | Target | Scenario |
|------|--------|----------|
| **Unit** | `MultiServiceSelector` | Add 2 services, verify total price/duration calculation. |
| **Unit** | `Adapter` | Transform sample API JSON to `Appointment` object correctly. |
| **E2E** | `Walk-in Flow` | Open Form -> Type non-existent phone -> Click Create -> Submit Booking. |
| **E2E** | `Multi-service` | Select "Combo A", find slot, book. Verify DB payload contains 2 items. |
| **Visual** | `BookingCard` | Verify "No-Show" status styling (Red border/badge). |

## 8. Development Checklist

- [ ] Does `AppointmentForm` still work for simple edits? (Backward/Forward compatibility).
- [ ] Are we using `useActionState` for form submissions?
- [ ] Is `shadcn/ui` used consistently (Dialog, Form, Select)?
- [ ] Are we handling Loading states for `AvailabilitySolver`?

## 9. Next Immediate Steps (PR 1)
1.  Define new `Appointment` interface in `types.ts` (keeping legacy fields optional for now).
2.  Implement `MultiServiceSelector` component.
3.  Update `appointment-form.tsx` to handle `serviceIds` array properly in the UI (even if backend currently takes first item).
