# Research Report: Spa Operating Hours Configuration

## 1. Introduction
This report outlines the research findings for implementing the Spa Operating Hours configuration feature in Synapse. The goal is to design a flexible, user-friendly system for managing regular business hours and exceptions (holidays, special events).

## 2. User Interface Best Practices
Based on industry standards for business hours configuration:

### 2.1. Structure & Grouping
- **Group Similar Days:** Allow users to configure "Weekdays" (Mon-Fri) and "Weekends" (Sat-Sun) together to reduce repetitive data entry.
- **Toggle for Closed Days:** Simple switch to mark a day as "Closed".
- **Multiple Shifts:** Support split shifts (e.g., Morning: 8:00 - 12:00, Afternoon: 13:00 - 17:00) by allowing multiple time ranges per day.

### 2.2. Time Input
- **Input Methods:**
  - **Dropdowns:** Standard 15-minute intervals (e.g., 08:00, 08:15).
  - **Sliders:** Visual representation of time blocks (good for visualizing coverage).
  - **Copy/Paste:** "Apply to all days" or "Copy to..." functionality.
- **Validation:**
  - End time must be after Start time.
  - No overlapping intervals on the same day.

### 2.3. Exceptions (Holidays)
- **Calendar View:** Visual calendar to select specific dates.
- **Override Logic:** Specific dates override regular weekly schedules.
- **Recurring Exceptions:** Option for annual holidays (e.g., New Year).

## 3. Database Schema Design
Recommended schema using SQLModel/PostgreSQL:

### 3.1. `regular_operating_hours`
Stores the standard weekly schedule.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `day_of_week` | Int | 0=Monday, 6=Sunday |
| `open_time` | Time | Opening time |
| `close_time` | Time | Closing time |
| `is_closed` | Bool | Is the business closed on this day? |

*Note: To support split shifts, we might need a separate table `operating_slots` linked to `regular_operating_hours`, or simply store a list of slots if using JSONB (though relational is better for querying).*

**Refined Approach for Split Shifts:**
Table `operating_slots`:
- `id`
- `day_of_week` (0-6)
- `start_time`
- `end_time`

### 3.2. `special_operating_hours`
Stores exceptions for specific dates.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `specific_date` | Date | The specific date |
| `is_closed` | Bool | Is closed? |
| `reason` | String | e.g., "Tet Holiday" |
| `start_time` | Time | Nullable |
| `end_time` | Time | Nullable |

## 4. Proposed Implementation Strategy

### 4.1. Backend (FastAPI)
- **Module:** `src/modules/settings`
- **Models:** `OperatingSlot`, `SpecialOperatingHour`
- **API:**
  - `GET /settings/hours`: Return combined schedule (regular + upcoming exceptions).
  - `PUT /settings/hours/regular`: Update weekly schedule.
  - `POST /settings/hours/special`: Add exception.

### 4.2. Frontend (Next.js)
- **Page:** `/admin/settings/general` (or dedicated `/admin/settings/hours`)
- **Components:**
  - `WeeklyScheduleEditor`: Rows for Mon-Sun, with "Add Slot" support.
  - `ExceptionCalendar`: Date picker to add holidays.
  - `TimeRangePicker`: Reusable component for start/end time.

## 5. Conclusion
The "Vertical Slice" architecture fits well here. We will create a `settings` module in backend and a corresponding feature in frontend. The UI should prioritize "Premium" feel with smooth interactions (sliders or smart dropdowns) and clear visual feedback.
