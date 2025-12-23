import { formatCurrency } from "@/shared/lib/utils";
import { ChevronUp } from "lucide-react";

interface FloatingSummaryProps {
  totalCount: number;
  totalPrice: number;
  totalDuration: number;
  onNext: () => void;
}

export const FloatingSummary = ({
  totalCount,
  totalPrice,
  totalDuration,
  onNext,
}: FloatingSummaryProps) => {
  if (totalCount === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-10 fixed bottom-0 left-0 right-0 z-40 duration-300">
      <div className="mx-auto max-w-2xl px-4 pb-4">
        <div
          className="bg-foreground text-background flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-lg"
          onClick={onNext}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{totalCount} dịch vụ</span>
              <span className="text-muted/50 text-sm">
                • {totalDuration} phút
              </span>
            </div>
            <span className="text-primary-foreground/80 text-sm font-medium">
              Tổng: {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="text-primary-foreground flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 font-semibold transition-colors hover:bg-white/20">
            Tiếp tục <ChevronUp className="h-4 w-4 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};
