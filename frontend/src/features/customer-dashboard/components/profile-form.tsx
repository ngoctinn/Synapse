"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { PROFILE_LABELS, PROFILE_MESSAGES } from "@/features/customer-dashboard/constants"
import { ProfileInput, profileSchema } from "@/features/customer-dashboard/schemas"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Cake, Camera, Loader2, Lock, MapPin, Phone, User } from "lucide-react"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { AvatarSelector } from "./avatar-selector"

interface ProfileFormProps {
  user: UserProfile
}

const initialState = {
  message: '',
  success: false,
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  // Date limits
  const minDate = new Date(1900, 0, 1)
  const maxDate = new Date()

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      dateOfBirth: user.dateOfBirth || "",
      avatarUrl: user.avatarUrl || "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  })

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showToast.success(PROFILE_MESSAGES.SUCCESS_TITLE, state.message)
      } else {
        showToast.error(PROFILE_MESSAGES.ERROR_TITLE, state.message)
      }
    }
  }, [state])

  const onSubmit = (values: ProfileInput) => {
    const formData = new FormData()
    formData.append("fullName", values.fullName)
    if (values.phone) formData.append("phone", values.phone)
    if (values.email) formData.append("email", values.email)
    if (values.address) formData.append("address", values.address)
    if (values.dateOfBirth) formData.append("dateOfBirth", values.dateOfBirth)
    if (values.avatarUrl) formData.append("avatarUrl", values.avatarUrl)

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="border shadow-sm bg-card">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {PROFILE_LABELS.TITLE}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {PROFILE_LABELS.DESCRIPTION}
                  </CardDescription>
                </div>
                {/* Optional: Add a subtle status indicator or edit mode toggle here if needed */}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Avatar & Identity */}
                <div className="flex flex-col items-center space-y-4 md:w-1/3 shrink-0">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center w-full">
                        <div className="relative group">
                          <AvatarSelector
                            currentAvatar={field.value}
                            onSelect={field.onChange}
                            trigger={
                              <div className="relative cursor-pointer rounded-full transition-opacity hover:opacity-90">
                                <Avatar className="h-28 w-28 border-2 border-border">
                                  <AvatarImage src={field.value} alt={user.fullName} className="object-cover" />
                                  <AvatarFallback className="text-2xl bg-muted text-muted-foreground font-medium">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm ring-2 ring-background">
                                  <Camera className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            }
                          />
                        </div>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="text-center w-full">
                    <h3 className="font-semibold text-base text-foreground">{user.fullName}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
                    </span>
                  </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">{PROFILE_LABELS.FULL_NAME}</FormLabel>
                          <FormControl>
                              <InputWithIcon
                                icon={User}
                                placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                                error={!!form.formState.errors.fullName}
                                className="h-9 text-sm"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
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
                              <FormLabel className="text-sm font-medium">{PROFILE_LABELS.PHONE}</FormLabel>
                              <FormControl>
                                  <InputWithIcon
                                    type="tel"
                                    icon={Phone}
                                    placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                                    error={!!form.formState.errors.phone}
                                    className="h-9 text-sm"
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
                          <FormLabel className="text-sm font-medium">{PROFILE_LABELS.EMAIL}</FormLabel>
                          <FormControl>
                            <InputWithIcon
                                type="email"
                                readOnly
                                disabled
                                icon={Lock}
                                placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                                className="h-9 bg-muted/50 text-muted-foreground cursor-not-allowed"
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
                            <FormLabel className="text-sm font-medium">{PROFILE_LABELS.ADDRESS}</FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={MapPin}
                                placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                                error={!!form.formState.errors.address}
                                className="h-9 text-sm"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isPending || !form.formState.isDirty}
                      size="sm"
                      className="min-w-[100px]"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          {PROFILE_LABELS.SUBMITTING}
                        </>
                      ) : (
                        PROFILE_LABELS.SUBMIT_BUTTON
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  )
}
