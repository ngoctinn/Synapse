"use client"

import { PROFILE_LABELS } from "@/features/customer-dashboard/constants"
import { ProfileInput } from "@/features/customer-dashboard/schemas"
import { Button } from "@/shared/ui/button"
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { format } from "date-fns"
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
                  className="h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      if (date && !isNaN(date.getTime())) {
                        field.onChange(format(date, "yyyy-MM-dd"))
                      } else if (date && isNaN(date.getTime())) {
                        field.onChange("INVALID_DATE")
                      } else {
                        field.onChange("")
                      }
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
                    className="h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
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
                <InputWithIcon
                  type="email"
                  readOnly
                  disabled
                  icon={Lock}
                  placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                  className="h-10 bg-muted/30 text-muted-foreground cursor-not-allowed border-dashed"
                  error={!!form.formState.errors.email}
                  {...field}
                />
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
                  className="h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end pt-6">
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
      </div>
    </div>
  )
}
