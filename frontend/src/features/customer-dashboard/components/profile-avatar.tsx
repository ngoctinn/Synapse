"use client"

import { PROFILE_LABELS } from "@/features/customer-dashboard/constants"
import { ProfileInput } from "@/features/customer-dashboard/schemas"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { FormField, FormItem, FormMessage } from "@/shared/ui/form"
import { Camera } from "lucide-react"
import { Control } from "react-hook-form"
import { AvatarSelector } from "./avatar-selector"

interface ProfileAvatarProps {
  user: UserProfile
  control: Control<ProfileInput>
}

export function ProfileAvatar({ user, control }: ProfileAvatarProps) {
  return (
    <div className="flex flex-col items-center space-y-6 md:w-1/3 shrink-0">
      <FormField
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center w-full">
            <div className="relative group">
              <AvatarSelector
                currentAvatar={field.value}
                onSelect={field.onChange}
                trigger={
                  <div className="relative cursor-pointer group/avatar">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl transition-transform duration-300 group-hover/avatar:scale-105">
                      <AvatarImage src={field.value} alt={user.fullName} className="object-cover" />
                      <AvatarFallback className="text-3xl bg-muted text-muted-foreground font-medium">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                      <Camera className="h-8 w-8 text-white drop-shadow-md" />
                    </div>

                    {/* Bottom Badge (Optional - keep or remove, keeping for visibility) */}
                    <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg ring-2 ring-background transition-transform duration-300 group-hover/avatar:scale-110 group-hover/avatar:rotate-12">
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>
                }

              />
            </div>
            <FormMessage className="mt-2 text-center" />
          </FormItem>
        )}
      />

      <div className="text-center w-full space-y-2">
        <h3 className="font-bold text-xl text-foreground tracking-tight">{user.fullName}</h3>
        <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
        <div className="pt-1">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
            {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
            </span>
        </div>
      </div>
    </div>
  )
}
