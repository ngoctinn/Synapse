export const HOLD_DURATION_MINUTES = 5;
export const HOLD_DURATION_SECONDS = HOLD_DURATION_MINUTES * 60;

export const STEPS = [
  { id: 1, title: 'Dịch vụ', path: 'services' },
  { id: 2, title: 'Kỹ thuật viên', path: 'technician' },
  { id: 3, title: 'Thời gian', path: 'time' },
  { id: 4, title: 'Xác nhận', path: 'payment' },
] as const;

export const BOOKING_WIZARD_STORAGE_KEY = 'booking-wizard-storage';
export const SESSION_ID_KEY = 'booking-session-id';
