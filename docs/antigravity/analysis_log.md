# Analysis Log - Customer Treatments Implementation

**Date:** 2025-12-19
**Scope:** Backend Phase 2 (Treatments)

## 1. Integration Points

### A. Services Module (`src/modules/services`)
- **Model:** `Service` (Existing)
- **Relation:** `CustomerTreatment` has optional `service_id` FK.
- **Goal:** Link a treatment package to a specific service definition (e.g., "10 sessions of Basic Facial").

### B. Bookings Module (`src/modules/bookings`)
- **Service (`service.py`):**
    - **`create` / `add_item`**: Needs validation.
        - Iterate through `booking_items`.
        - If `treatment_id` exists:
            - Query `CustomerTreatment`.
            - Check `customer_id` match.
            - Check `expiry_date >= today`.
            - Check `used_sessions < total_sessions`.
            - *Concurrency:* Need to be careful with double spending if 2 bookings happen simultaneously.
    - **`complete`**: Needs "Punch" logic.
        - Iterate items.
        - `used_sessions += 1`.
        - Check `used_sessions <= total_sessions`.
        - Update Reference: `CustomerTreatment`.

## 2. Decision Log

- **State Machine:**
    - `Punch` happens strictly at `complete()` (Status: IN_PROGRESS -> COMPLETED).
    - `Refund` is NOT required for standard flow because `cancel()` is currently blocked for COMPLETED bookings.
    - *Future Proofing:* Logic `refund_session` will be implemented in `CustomerTreatmentService` but might not be called by `BookingService` yet until we allow "Undo Complete".

- **Dependency Injection:**
    - `BookingService` will import `CustomerTreatment` model directly and use the shared `session` to execute updates within the same transaction. This ensures atomicity.

## 3. Action Items
1.  Create `CustomerTreatment` model.
2.  Add `treatment_id` to `BookingItem` (Migration).
3.  Modify `BookingService.create` to validate.
4.  Modify `BookingService.complete` to punch.
