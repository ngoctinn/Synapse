"use client";

import { PROFILE_LABELS } from "@/features/customer-dashboard/constants";
import { ProfileInput } from "@/features/customer-dashboard";
import { UserProfile } from "@/features/customer-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { Camera } from "lucide-react";
import { Control } from "react-hook-form";
import { AvatarSelector } from "./avatar-selector";

interface ProfileAvatarProps {
  user: UserProfile;
  control: Control<ProfileInput>;
}

export function ProfileAvatar({ user, control }: ProfileAvatarProps) {
  return (
    <div className="flex shrink-0 flex-col items-center space-y-6 md:w-1/3">
      <FormField
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-center">
            <div className="group relative">
              <AvatarSelector
                currentAvatar={field.value}
                onSelect={field.onChange}
                trigger={
                  <div className="group/avatar relative cursor-pointer">
                    <Avatar className="border-background h-32 w-32 border-4 shadow-xl transition-transform duration-300 group-hover/avatar:scale-105">
                      <AvatarImage
                        src={field.value}
                        alt={user.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-medium">
                        {user.fullName
                          ? user.fullName.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover/avatar:opacity-100">
                      <Camera className="h-8 w-8 text-white drop-shadow-md" />
                    </div>

                    {/* Bottom Badge (Optional - keep or remove, keeping for visibility) */}
                    <div className="bg-primary text-primary-foreground ring-background absolute bottom-1 right-1 rounded-full p-2 shadow-lg ring-2 transition-transform duration-300 group-hover/avatar:rotate-12 group-hover/avatar:scale-110">
                      <Camera className="size-4" />
                    </div>
                  </div>
                }
              />
            </div>
            <FormMessage className="mt-2 text-center" />
          </FormItem>
        )}
      />

      <div className="w-full space-y-2 text-center">
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          {user.fullName}
        </h3>
        <p className="text-muted-foreground text-sm font-medium">
          {user.email}
        </p>
        <div className="pt-1">
          <Badge variant="soft">
            {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
          </Badge>
        </div>
      </div>
    </div>
  );
}
