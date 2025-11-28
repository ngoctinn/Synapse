---
title: Appointment Components Design
status: draft
---

# Design: Appointment Components

## 1. Architecture Changes
-   No major architectural changes.
-   New components will be added to `src/shared/ui/custom` or `src/shared/ui` if generic enough.

## 2. Component Design

### 2.1. DatePicker (`src/shared/ui/custom/date-picker.tsx`)
-   **Base**: Wrapper around Shadcn `Calendar` and `Popover`.
-   **Props**: `value` (Date), `onChange` (function), `placeholder` (string).
-   **Features**:
    -   Display date in `dd/MM/yyyy` format.
    -   Vietnamese localization for months/days.
    -   "Hôm nay" (Today) shortcut.

### 2.2. TimePicker (`src/shared/ui/custom/time-picker.tsx`)
-   **Base**: Custom implementation or specialized library wrapper.
-   **Props**: `value` (string "HH:mm"), `onChange` (function).
-   **Features**:
    -   24h format.
    -   Scrollable columns for Hour and Minute (or distinct input fields).
    -   Step options (e.g., 15-minute intervals).

### 2.3. DateTimePicker (`src/shared/ui/custom/date-time-picker.tsx`)
-   **Base**: Combination of DatePicker and TimePicker.
-   **Usage**: For scheduling specific appointment slots.

## 3. Data Model
-   N/A (UI components only).

## 4. Security & Performance
-   Use `React.memo` if components become heavy.
-   Ensure proper cleanup of event listeners (popovers).
