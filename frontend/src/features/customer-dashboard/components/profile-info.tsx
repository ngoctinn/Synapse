"use client"

import { PROFILE_LABELS } from "@/features/customer-dashboard/constants"
import { ProfileInput } from "@/features/customer-dashboard/schemas"
import { Button } from "@/shared/ui/button"
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Cake, Loader2, Lock, MapPin, Phone, User } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

interface ProfileInfoProps {
  form: UseFormReturn<ProfileInput>
  isPending: boolean
  minDate: Date
  maxDate: Date
}

export function ProfileInfo({ form, isPending, minDate, maxDate }: ProfileInfoProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80">{PROFILE_LABELS.FULL_NAME}</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={User}
                  placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                  error={!!form.formState.errors.fullName}
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground/80">{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
                <FormControl>
                  <BirthdayPicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => {
                      // Handle date selection: valid date -> format string, invalid -> error code, null -> empty
                      const newValue = date
                        ? (isNaN(date.getTime()) ? "INVALID_DATE" : format(date, "yyyy-MM-dd"))
                        : "";
                      field.onChange(newValue);
                    }}
                    icon={Cake}
                    minDate={minDate}
                    maxDate={maxDate}
                    error={!!form.formState.errors.dateOfBirth}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground/80">{PROFILE_LABELS.PHONE}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    type="tel"
                    icon={Phone}
                    placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                    error={!!form.formState.errors.phone}
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80">{PROFILE_LABELS.EMAIL}</FormLabel>
              <FormControl>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="relative">
                         <InputWithIcon
                          type="email"
                          readOnly
                          disabled
                          icon={Lock}
                          placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                          className="h-10 bg-muted/30 text-muted-foreground cursor-not-allowed border-dashed focus-visible:ring-0 focus-visible:ring-offset-0"
                          error={!!form.formState.errors.email}
                          {...field}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-popover text-popover-foreground text-xs shadow-md">
                      <p>{PROFILE_LABELS.EMAIL_TOOLTIP}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80">{PROFILE_LABELS.ADDRESS}</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={MapPin}
                  placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                  error={!!form.formState.errors.address}
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end pt-6">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            size="default"
            className="min-w-[140px] font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {PROFILE_LABELS.SUBMITTING}
              </>
            ) : (
              PROFILE_LABELS.SUBMIT_BUTTON
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
