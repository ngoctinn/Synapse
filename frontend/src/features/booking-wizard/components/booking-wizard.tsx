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
  const { currentStep, goToStep, selectedServices, staffId, holdExpiresAt, clearHold, selectedDate, selectedSlot, customerInfo, reset } = useBookingStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServicesStep />;
      case 2:
        return <TechnicianStep />;
      case 3:
        return <TimeStep />;
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
      // Mock confirmation
      setIsSuccess(true);
      clearHold(); // Clear hold timer
    }
  };

  // Step 1 uses FloatingSummary, so we can hide the main footer or disable it
  // Strategy: Main footer is sticky, FloatingSummary is also fixed.
  // UX Decision: Step 1 hides main footer, uses FloatingSummary for "Add to Cart" feel.
  // Step 2-5 use Main Footer.
  const showMainFooter = currentStep !== 1 && !isSuccess;

  // Validation for enabling Next button
  const canProceed = () => {
    if (currentStep === 1) return selectedServices.length > 0;
    if (currentStep === 2) return !!staffId;
    if (currentStep === 3) return !!selectedDate && !!selectedSlot;
    if (currentStep === 4) {
      if (!customerInfo) return false;
      const result = customerInfoSchema.safeParse(customerInfo);
      return result.success;
    }
    if (currentStep === 5) return true;
    return true;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <BookingSuccess
          onBookAnother={() => {
            setIsSuccess(false);
            reset();
          }}
          bookingTime={selectedSlot ? new Date(`${selectedSlot.date}T${selectedSlot.start_time}`) : new Date()}
          serviceName={selectedServices[0]?.name}
          // staffName logic could be improved by fetching staff details
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <WizardHeader />
        {holdExpiresAt && (
          <div className="container max-w-2xl mx-auto px-4 py-2 flex justify-center">
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

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 pb-32 animate-in fade-in duration-500">
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
