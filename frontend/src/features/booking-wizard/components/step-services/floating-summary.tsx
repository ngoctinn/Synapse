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
    <div className="fixed bottom-[72px] left-0 right-0 px-4 z-40 animate-in slide-in-from-bottom-10 duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-foreground text-background rounded-xl p-4 shadow-lg flex items-center justify-between cursor-pointer" onClick={onNext}>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{totalCount} dịch vụ</span>
              <span className="text-muted/50 text-sm">• {totalDuration} phút</span>
            </div>
            <span className="text-sm font-medium text-primary-foreground/80">
              Tổng: {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-primary-foreground font-semibold bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
            Tiếp tục <ChevronUp className="h-4 w-4 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};
