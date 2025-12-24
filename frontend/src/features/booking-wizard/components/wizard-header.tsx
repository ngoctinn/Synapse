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
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-2xl items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 mr-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Quay lại</span>
        </Button>

        <div className="flex-1">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Placeholder for right-side actions (e.g., Help, Home) */}
        <div className="w-10" />
      </div>
    </header>
  );
};
