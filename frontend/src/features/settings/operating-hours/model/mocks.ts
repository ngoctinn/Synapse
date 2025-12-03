import { OperatingHoursConfig, DayOfWeek } from './types';

const defaultSchedule: { day: DayOfWeek; label: string }[] = [
  { day: 'monday', label: 'Thứ Hai' },
  { day: 'tuesday', label: 'Thứ Ba' },
  { day: 'wednesday', label: 'Thứ Tư' },
  { day: 'thursday', label: 'Thứ Năm' },
  { day: 'friday', label: 'Thứ Sáu' },
  { day: 'saturday', label: 'Thứ Bảy' },
  { day: 'sunday', label: 'Chủ Nhật' },
];

export const MOCK_OPERATING_HOURS: OperatingHoursConfig = {
  defaultSchedule: defaultSchedule.map((item) => ({
    day: item.day,
    isOpen: item.day !== 'sunday', // Example: Closed on Sunday
    timeSlots: [
      { start: '09:00', end: '18:00' },
    ],
  })),
  exceptions: [
    {
      id: '1',
      date: new Date(new Date().getFullYear(), 0, 1), // New Year
      reason: 'Tết Dương Lịch',
      type: 'holiday',
      isClosed: true,
    },
    {
      id: '2',
      date: new Date(new Date().getFullYear(), 3, 30), // 30/4
      reason: 'Giải phóng miền Nam',
      type: 'holiday',
      isClosed: true,
    },
  ],
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Thứ Hai',
  tuesday: 'Thứ Ba',
  wednesday: 'Thứ Tư',
  thursday: 'Thứ Năm',
  friday: 'Thứ Sáu',
  saturday: 'Thứ Bảy',
  sunday: 'Chủ Nhật',
};
