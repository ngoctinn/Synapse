"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { PROFILE_LABELS, PROFILE_MESSAGES } from "@/features/customer-dashboard/constants"
import { ProfileInput, profileSchema } from "@/features/customer-dashboard/schemas"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { BirthdayPicker } from "@/shared/ui/custom/birthday-picker"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"
import { zodResolver } from "@hookform/resolvers/zod"
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
    mode: "onBlur", // Validate on blur for better UX
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-muted/30 pb-8">
              <CardTitle className="text-2xl font-bold text-primary">{PROFILE_LABELS.TITLE}</CardTitle>
              <CardDescription className="text-base">
                {PROFILE_LABELS.DESCRIPTION}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Cột Trái: Avatar */}
                <div className="flex flex-col items-center space-y-6 lg:w-1/3 lg:border-r lg:pr-10">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <div className="relative">
                          <AvatarSelector
                            currentAvatar={field.value}
                            onSelect={field.onChange}
                            trigger={
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative group cursor-pointer"
                              >
                                <Avatar className="h-40 w-40 border-4 border-background shadow-2xl ring-4 ring-muted/50 transition-all duration-300 group-hover:ring-primary/20">
                                  <AvatarImage src={field.value} alt={user.fullName} className="object-cover" />
                                  <AvatarFallback className="text-5xl bg-primary/5 text-primary font-bold">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors ring-2 ring-background">
                                  <Camera className="h-5 w-5" />
                                </div>
                              </motion.div>
                            }
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-xl text-foreground">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
                    <div className="pt-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                        {PROFILE_LABELS.MEMBER_TIER} {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Form Fields */}
                <div className="flex-1 space-y-8">
                  {/* Nhóm 1: Thông tin định danh */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                      {PROFILE_LABELS.SECTION_IDENTITY}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PROFILE_LABELS.FULL_NAME}</FormLabel>
                            <FormControl>
                                <InputWithIcon
                                  icon={User}
                                  placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                                  error={!!form.formState.errors.fullName}
                                  {...field}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
                            <FormControl>
                              <BirthdayPicker
                                date={field.value ? new Date(field.value) : undefined}
                                setDate={(date) => {
                                  // Convert Date object back to string YYYY-MM-DD for schema
                                  // Use local time to avoid timezone issues
                                  if (date && !isNaN(date.getTime())) {
                                    const offset = date.getTimezoneOffset()
                                    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
                                    field.onChange(localDate.toISOString().split('T')[0])
                                  } else if (date && isNaN(date.getTime())) {
                                    // Handle invalid date (e.g. 40/40/2000) by setting a value that fails Zod schema
                                    field.onChange("INVALID_DATE")
                                  } else {
                                    field.onChange("")
                                  }
                                }}
                                icon={Cake}
                                minDate={minDate}
                                maxDate={maxDate}
                                // Pass error state to BirthdayPicker if needed, though FormMessage handles display
                                error={!!form.formState.errors.dateOfBirth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Nhóm 2: Thông tin liên hệ */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                      {PROFILE_LABELS.SECTION_CONTACT}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PROFILE_LABELS.PHONE}</FormLabel>
                            <FormControl>
                                <InputWithIcon
                                  type="tel"
                                  icon={Phone}
                                  placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                                  error={!!form.formState.errors.phone}
                                  {...field}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PROFILE_LABELS.EMAIL}</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <FormControl>
                                  <div className="cursor-not-allowed">
                                      <InputWithIcon
                                        type="email"
                                        readOnly
                                        disabled
                                        icon={Lock}
                                        placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                                        className="bg-muted/50 text-muted-foreground border-dashed"
                                        error={!!form.formState.errors.email}
                                        {...field}
                                      />
                                  </div>
                                </FormControl>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{PROFILE_LABELS.EMAIL_TOOLTIP}</p>
                              </TooltipContent>
                            </Tooltip>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{PROFILE_LABELS.ADDRESS}</FormLabel>
                          <FormControl>
                            <InputWithIcon
                              icon={MapPin}
                              placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                              error={!!form.formState.errors.address}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-muted/30 p-8 border-t">
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="min-w-[140px] shadow-lg hover:shadow-xl transition-all"
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
            </CardFooter>
          </Card>
        </form>
      </Form>
    </motion.div>
  )
}
