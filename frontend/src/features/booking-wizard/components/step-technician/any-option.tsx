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
        "cursor-pointer transition-all duration-200 border-2 hover:border-muted-foreground/20 bg-card",
        isSelected && "border-primary bg-primary/5 shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center p-4 gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Users className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-base">Bất kỳ kỹ thuật viên nào</h3>
          <p className="text-sm text-muted-foreground">
            Được đề xuất để có nhiều khung giờ trống nhất
          </p>
        </div>

        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    </Card>
  );
};
