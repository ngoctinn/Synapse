import { useState } from "react";
import { useBookingStore } from "../hooks/use-booking-store";
import { customerInfoSchema } from "../schemas";
import { BookingSuccess } from "./booking-success";
import { CustomerInfoStep } from "./step-payment/customer-info-step";
import { ServicesStep } from "./step-services/services-step";
import { TechnicianStep } from "./step-technician/technician-step";
import { HoldTimer } from "./step-time/hold-timer";
import { TimeStep } from "./step-time/time-step";
import { SummaryStep } from "./step-summary/summary-step";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";

export const BookingWizard = () => {
  const {
    currentStep,
    goToStep,
    selectedServices,
    staffId,
    holdExpiresAt,
    clearHold,
    selectedDate,
    selectedSlot,
    customerInfo,
    reset,
  } = useBookingStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServicesStep />;
      case 2:
        return <TimeStep />;
      case 3:
        return <TechnicianStep />;
      case 4:
        return <CustomerInfoStep />;
      case 5:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      goToStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      // TODO: Gửi dữ liệu đặt lịch thực tế đến Backend API tại đây
      setIsSuccess(true);
      clearHold();
    }
  };

  // Step 1 uses FloatingSummary, so we can hide the main footer or disable it
  // Strategy: Main footer is sticky, FloatingSummary is also fixed.
  // UX Decision: Step 1 hides main footer, uses FloatingSummary for "Add to Cart" feel.
  // Step 2-5 use Main Footer.
  const showMainFooter = currentStep !== 1 && !isSuccess;

  // Validation for enabling Next button
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

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center">
        <BookingSuccess
          onBookAnother={() => {
            setIsSuccess(false);
            reset();
          }}
          bookingTime={
            selectedSlot
              ? new Date(`${selectedSlot.date}T${selectedSlot.start_time}`)
              : new Date()
          }
          serviceName={selectedServices[0]?.name}
          // staffName logic could be improved by fetching staff details
        />
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <WizardHeader />
        {holdExpiresAt && (
          <div className="container mx-auto flex max-w-2xl justify-center px-4 py-2">
            <HoldTimer
              expiresAt={holdExpiresAt}
              onExpire={() => {
                clearHold();
                // Optionally show a toast or modal here
              }}
            />
          </div>
        )}
      </div>

      <main className="animate-in fade-in container mx-auto max-w-2xl flex-1 px-4 py-6 pb-20 duration-500 md:pb-24">
        {renderStep()}
      </main>

      {showMainFooter && (
        <WizardFooter
          onNext={handleNext}
          nextLabel={currentStep === 5 ? "Xác nhận đặt lịch" : "Tiếp tục"}
          isDisabled={!canProceed()}
        />
      )}
    </div>
  );
};
