import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BOOKING_WIZARD_STORAGE_KEY } from '../constants';
import { clearSessionId } from '../lib/session-id';
import { BookingState, CustomerInfo, ServiceItem, TimeSlot } from '../types';

interface BookingActions {
  // Step 1: Services
  addService: (service: ServiceItem) => void;
  removeService: (serviceId: string) => void;
  setServices: (services: ServiceItem[]) => void;

  // Step 2: Staff
  setStaff: (staffId: string | 'any' | null, staffName?: string) => void;

  // Step 3: Time
  setSlot: (date: Date, slot: TimeSlot, holdId: string, expiresAt: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  clearHold: () => void;

  // Step 4: Payment
  setCustomerInfo: (info: CustomerInfo) => void;

  // Navigation
  goToStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  reset: () => void;
}

type BookingStore = BookingState & BookingActions;

const initialState: BookingState = {
  selectedServices: [],
  staffId: 'any', // Default to any staff for better availability
  staffName: 'Bất kỳ nhân viên',
  selectedDate: null,
  selectedSlot: null,
  holdId: null,
  holdExpiresAt: null,
  customerInfo: null,
  currentStep: 1,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Step 1
      addService: (service) =>
        set((state) => ({
          selectedServices: [...state.selectedServices, service],
        })),
      removeService: (serviceId) =>
        set((state) => ({
          selectedServices: state.selectedServices.filter((s) => s.id !== serviceId),
        })),
      setServices: (services) => set({ selectedServices: services }),

      // Step 2
      setStaff: (staffId, staffName) => set({ staffId, staffName: staffName || null }),

      // Step 3
      setSlot: (date, slot, holdId, expiresAt) =>
        set({
          selectedDate: date,
          selectedSlot: slot,
          holdId,
          holdExpiresAt: expiresAt,
        }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedSlot: (slot) => set({ selectedSlot: slot }),
      clearHold: () =>
        set({
          selectedDate: null,
          selectedSlot: null,
          holdId: null,
          holdExpiresAt: null,
        }),

      setCustomerInfo: (info) => set({ customerInfo: info }),

      // Navigation
      goToStep: (step) => set({ currentStep: step }),
      reset: () => {
        clearSessionId();
        set(initialState);
      },
    }),
    {
      name: BOOKING_WIZARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedServices: state.selectedServices,
        staffId: state.staffId,
        staffName: state.staffName,
        selectedDate: state.selectedDate,
        selectedSlot: state.selectedSlot,
        holdId: state.holdId,
        holdExpiresAt: state.holdExpiresAt,
        customerInfo: state.customerInfo,
        currentStep: state.currentStep,
      }),
    }
  )
);
