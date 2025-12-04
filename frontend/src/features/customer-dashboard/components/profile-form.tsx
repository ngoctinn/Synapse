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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="overflow-hidden border-none shadow-xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 py-0 gap-0">
            <CardHeader className="p-4 border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground tracking-tight">
                    {PROFILE_LABELS.TITLE}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground/80 mt-0.5">
                    {PROFILE_LABELS.DESCRIPTION}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left Column: Avatar & Identity - More compact */}
                <div className="flex flex-col items-center space-y-4 md:w-1/3 w-full">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center w-full">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-primary/40 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                          <AvatarSelector
                            currentAvatar={field.value}
                            onSelect={field.onChange}
                            trigger={
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative cursor-pointer bg-background rounded-full p-1"
                              >
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                  <AvatarImage src={field.value} alt={user.fullName} className="object-cover" />
                                  <AvatarFallback className="text-4xl bg-primary/5 text-primary font-bold">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-all duration-300 ring-2 ring-background group-hover:scale-110">
                                  <Camera className="h-4 w-4" />
                                </div>
                              </motion.div>
                            }
                          />
                        </div>
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />

                  <div className="text-center space-y-2 w-full">
                    <div>
                      <h3 className="font-bold text-lg text-foreground tracking-tight">{user.fullName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
                    </div>

                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                        </span>
                        {PROFILE_LABELS.MEMBER_TIER} {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Form Fields - Single column on mobile, compact grid on desktop */}
                <div className="flex-1 w-full space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 font-medium text-sm">{PROFILE_LABELS.FULL_NAME}</FormLabel>
                          <FormControl>
                              <InputWithIcon
                                icon={User}
                                placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                                error={!!form.formState.errors.fullName}
                                className="h-10 bg-background/50 focus:bg-background transition-colors text-sm"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80 font-medium text-sm">{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
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
                              <FormLabel className="text-foreground/80 font-medium text-sm">{PROFILE_LABELS.PHONE}</FormLabel>
                              <FormControl>
                                  <InputWithIcon
                                    type="tel"
                                    icon={Phone}
                                    placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                                    error={!!form.formState.errors.phone}
                                    className="h-10 bg-background/50 focus:bg-background transition-colors text-sm"
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
                          <FormLabel className="text-foreground/80 font-medium text-sm">{PROFILE_LABELS.EMAIL}</FormLabel>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <FormControl>
                                <div className="cursor-not-allowed opacity-80">
                                    <InputWithIcon
                                      type="email"
                                      readOnly
                                      disabled
                                      icon={Lock}
                                      placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                                      className="h-10 bg-muted/30 text-muted-foreground border-dashed focus-visible:ring-0 text-sm"
                                      error={!!form.formState.errors.email}
                                      {...field}
                                    />
                                </div>
                              </FormControl>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-foreground text-background">
                              <p>{PROFILE_LABELS.EMAIL_TOOLTIP}</p>
                            </TooltipContent>
                          </Tooltip>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground/80 font-medium text-sm">{PROFILE_LABELS.ADDRESS}</FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={MapPin}
                                placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                                error={!!form.formState.errors.address}
                                className="h-10 bg-background/50 focus:bg-background transition-colors text-sm"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border/40">
                    <Button
                      type="submit"
                      disabled={isPending || !form.formState.isDirty}
                      size="default"
                      className="min-w-[140px] shadow-md hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
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
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  )
}
