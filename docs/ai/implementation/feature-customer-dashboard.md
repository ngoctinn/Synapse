# Refine Customer Dashboard UX/UI

## Goal Description
Enhance the visual appeal and user experience of the Customer Dashboard, specifically the Appointments page and the Sidebar, to meet "Premium" and "Vietnamese" standards.

## User Review Required
> [!NOTE]
> - **Sidebar**: Will be made "sticky" so it stays visible while scrolling.
> - **Appointment Cards**: Will have hover effects, better typography, and a "Details" button.
> - **Empty State**: Will include a Call-to-Action (CTA) to book a new appointment.

## Proposed Changes

### Customer Dashboard Feature
#### [MODIFY] [components/dashboard-nav.tsx](file:///e:/Projects/Synapse/frontend/src/features/customer-dashboard/components/dashboard-nav.tsx)
- Add `sticky top-20` to make it float while scrolling.
- Improve styling of active state (bold, primary color background with subtle opacity).
- Add icons to all items.

#### [MODIFY] [components/appointment-list.tsx](file:///e:/Projects/Synapse/frontend/src/features/customer-dashboard/components/appointment-list.tsx)
- **Card Design**:
    - Add `hover:shadow-md transition-shadow` to cards.
    - Use a grid layout within the card for better information density.
    - Highlight Date and Time.
- **Actions**:
    - Add a "Chi tiết" (Details) button (outline variant) to each card.
- **Empty State**:
    - Add a "Đặt lịch ngay" button that links to the booking page (mock link).

#### [MODIFY] [components/treatment-list.tsx](file:///e:/Projects/Synapse/frontend/src/features/customer-dashboard/components/treatment-list.tsx)
- Apply similar "Premium" card styling for consistency.

## Verification Plan

### Manual Verification
1.  **Desktop**:
    - Verify Sidebar is sticky.
    - Verify Appointment Cards have hover effects.
    - Verify "Chi tiết" button exists.
2.  **Mobile**:
    - Verify Cards stack correctly.
    - Verify Bottom Nav is still visible and functional.
