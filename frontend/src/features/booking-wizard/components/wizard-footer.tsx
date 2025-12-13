import { Button } from "@/shared/ui/button";
import { useBookingStore } from "../hooks/use-booking-store";
import { Loader2 } from "lucide-react";

interface WizardFooterProps {
  isLoading?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  isDisabled?: boolean;
}

export const WizardFooter = ({ 
  isLoading = false, 
  onNext, 
  nextLabel = "Tiếp tục",
  isDisabled = false
}: WizardFooterProps) => {
  const { currentStep } = useBookingStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container max-w-2xl mx-auto flex gap-3">
         <Button 
          className="w-full text-lg h-12" 
          size="lg"
          onClick={onNext}
          disabled={isDisabled || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {nextLabel}
        </Button>
      </div>
    </div>
  );
};
