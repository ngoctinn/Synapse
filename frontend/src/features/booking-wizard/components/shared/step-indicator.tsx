import { cn } from "@/shared/lib/utils";
import { STEPS } from "../../constants";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full py-4">
      <div className="relative mx-auto flex max-w-sm items-center justify-between sm:max-w-md">
        {/* Progress Bar Background */}
        <div className="bg-muted absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full" />

        {/* Active Progress Bar */}
        <div
          className="bg-primary absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="bg-background flex flex-col items-center gap-2 px-1"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium transition-colors duration-300 sm:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      {/* Mobile Title Display */}
      <div className="mt-2 flex flex-col items-center text-center sm:hidden">
        <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
          Bước {currentStep} / {STEPS.length}
        </span>
        <span className="text-sm font-semibold">
          {STEPS[currentStep - 1].title}
        </span>
      </div>
    </div>
  );
};
