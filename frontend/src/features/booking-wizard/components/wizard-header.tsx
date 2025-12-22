import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBookingStore } from "../hooks/use-booking-store";
import { StepIndicator } from "./shared/step-indicator";
import { useRouter } from "next/navigation";

export const WizardHeader = () => {
  const { currentStep, goToStep } = useBookingStore();
  const router = useRouter();

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as 1 | 2 | 3 | 4);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 -ml-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Quay lại</span>
        </Button>

        <div className="flex-1">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Placeholder for right-side actions (e.g., Help, Home) */}
        <div className="w-9" />
      </div>
    </header>
  );
};
