"use client";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Check, Star } from "lucide-react";
import { StaffItem } from "../../types";

interface StaffListProps {
  staff: StaffItem[];
  selectedStaffId: string | null;
  onSelect: (staff: StaffItem) => void;
}

export const StaffList = ({
  staff,
  selectedStaffId,
  onSelect,
}: StaffListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {staff.map((member) => {
        const isSelected = selectedStaffId === member.id;

        return (
          <Card
            key={member.id}
            className={cn(
              "hover:border-muted-foreground/20 bg-card relative cursor-pointer overflow-hidden border-2 transition-all duration-200",
              isSelected && "border-primary bg-primary/5 shadow-md",
              !member.is_available && "cursor-not-allowed opacity-60 grayscale"
            )}
            onClick={() => member.is_available && onSelect(member)}
          >
            <div className="flex items-center gap-4 p-4">
              <Avatar className="border-background h-14 w-14 border-2">
                <AvatarImage src={member.avatar_url} alt={member.name} />
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="truncate pr-2 text-base font-semibold">
                    {member.name}
                  </h3>
                  {member.rating && (
                    <div className="flex items-center rounded-lg bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-500">
                      <Star className="mr-0.5 h-3 w-3 fill-current" />
                      {member.rating}
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground truncate text-sm">
                  {member.role}
                </p>

                {member.is_available && (
                  <div className="mt-2 flex items-center">
                    <Badge variant="success" size="xs">
                      Có chỗ hôm nay
                    </Badge>
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="bg-primary text-primary-foreground absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full">
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
