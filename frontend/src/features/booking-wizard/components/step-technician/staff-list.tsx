import { Card } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Check, Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { StaffItem } from "../../types";

interface StaffListProps {
  staff: StaffItem[];
  selectedStaffId: string | null;
  onSelect: (staff: StaffItem) => void;
}

export const StaffList = ({ staff, selectedStaffId, onSelect }: StaffListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {staff.map((member) => {
        const isSelected = selectedStaffId === member.id;
        
        return (
          <Card
            key={member.id}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2 hover:border-muted-foreground/20 bg-card relative overflow-hidden",
              isSelected && "border-primary bg-primary/5 shadow-md",
              !member.is_available && "opacity-60 cursor-not-allowed grayscale"
            )}
            onClick={() => member.is_available && onSelect(member)}
          >
            <div className="flex items-center p-4 gap-4">
              <Avatar className="h-14 w-14 border-2 border-background">
                <AvatarImage src={member.avatar_url} alt={member.name} />
                <AvatarFallback className="bg-muted font-semibold text-muted-foreground">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base truncate pr-2">{member.name}</h3>
                  {member.rating && (
                    <div className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      {member.rating}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                
                {member.is_available && (
                   <div className="mt-2 flex items-center">
                     <Badge variant="secondary" className="text-[10px] h-5 font-normal px-2 bg-green-100 text-green-700 hover:bg-green-100">
                        Có chỗ hôm nay
                     </Badge>
                   </div>
                )}
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
