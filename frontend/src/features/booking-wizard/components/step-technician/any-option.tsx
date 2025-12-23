import { Card } from "@/shared/ui/card";
import { Check, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AnyOptionProps {
  isSelected: boolean;
  onSelect: () => void;
}

export const AnyOption = ({ isSelected, onSelect }: AnyOptionProps) => {
  return (
    <Card
      className={cn(
        "hover:border-muted-foreground/20 bg-card cursor-pointer border-2 transition-all duration-200",
        isSelected && "border-primary bg-primary/5 shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full">
          <Users className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold">Bất kỳ kỹ thuật viên nào</h3>
          <p className="text-muted-foreground text-sm">
            Được đề xuất để có nhiều khung giờ trống nhất
          </p>
        </div>

        {isSelected && (
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    </Card>
  );
};
