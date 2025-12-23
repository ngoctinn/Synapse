import { Button } from "@/shared/ui/button";
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
  isDisabled = false,
}: WizardFooterProps) => {
  // const { currentStep } = useBookingStore();

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-50 border-t p-4 backdrop-blur">
      <div className="container mx-auto flex max-w-2xl gap-3">
        <Button
          className="h-12 w-full text-lg"
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
