import { customerInfoSchema } from "../schemas";
import { useBookingStore } from "./use-booking-store";

export const useBookingValidation = () => {
  const {
    currentStep,
    selectedServices,
    selectedDate,
    selectedSlot,
    staffId,
    customerInfo,
  } = useBookingStore();

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedServices.length > 0;
      case 2:
        return !!selectedDate && !!selectedSlot;
      case 3:
        return !!staffId;
      case 4:
        if (!customerInfo) return false;
        return customerInfoSchema.safeParse(customerInfo).success;
      case 5:
        return true;
      default:
        return true;
    }
  };

  return { canProceed };
};
