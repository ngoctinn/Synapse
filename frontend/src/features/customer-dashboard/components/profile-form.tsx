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
      className="w-full max-w-4xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="overflow-hidden border-none shadow-xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5">
            <CardHeader className="p-6 border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                    {PROFILE_LABELS.TITLE}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80 mt-1">
                    {PROFILE_LABELS.DESCRIPTION}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Column: Avatar & Identity */}
                <div className="flex flex-col items-center space-y-6 lg:w-1/3 w-full shrink-0">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center w-full">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/40 rounded-full opacity-60 blur-md group-hover:opacity-80 transition duration-500"></div>
                          <AvatarSelector
                            currentAvatar={field.value}
                            onSelect={field.onChange}
                            trigger={
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative cursor-pointer bg-background rounded-full p-1.5 ring-2 ring-background shadow-xl"
                              >
                                <Avatar className="h-40 w-40 border-4 border-background shadow-inner">
                                  <AvatarImage src={field.value} alt={user.fullName} className="object-cover" />
                                  <AvatarFallback className="text-5xl bg-primary/5 text-primary font-bold">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 ring-4 ring-background group-hover:scale-110">
                                  <Camera className="h-5 w-5" />
                                </div>
                              </motion.div>
                            }
                          />
                        </div>
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />

                  <div className="text-center space-y-3 w-full px-4 py-4 rounded-2xl bg-muted/30 border border-border/40">
                    <div>
                      <h3 className="font-bold text-xl text-foreground tracking-tight">{user.fullName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
                    </div>

                    <div className="flex justify-center pt-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        {PROFILE_LABELS.MEMBER_TIER} {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold text-sm ml-1">{PROFILE_LABELS.FULL_NAME}</FormLabel>
                          <FormControl>
                              <InputWithIcon
                                icon={User}
                                placeholder={PROFILE_LABELS.FULL_NAME_PLACEHOLDER}
                                error={!!form.formState.errors.fullName}
                                className="h-11 bg-background/50 focus:bg-background transition-all shadow-sm hover:shadow-md focus:shadow-md text-base"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-semibold text-sm ml-1">{PROFILE_LABELS.DATE_OF_BIRTH}</FormLabel>
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
                              <FormLabel className="text-foreground font-semibold text-sm ml-1">{PROFILE_LABELS.PHONE}</FormLabel>
                              <FormControl>
                                  <InputWithIcon
                                    type="tel"
                                    icon={Phone}
                                    placeholder={PROFILE_LABELS.PHONE_PLACEHOLDER}
                                    error={!!form.formState.errors.phone}
                                    className="h-11 bg-background/50 focus:bg-background transition-all shadow-sm hover:shadow-md focus:shadow-md text-base"
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
                          <FormLabel className="text-foreground font-semibold text-sm ml-1">{PROFILE_LABELS.EMAIL}</FormLabel>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <FormControl>
                                <div className="cursor-not-allowed opacity-75">
                                    <InputWithIcon
                                      type="email"
                                      readOnly
                                      disabled
                                      icon={Lock}
                                      placeholder={PROFILE_LABELS.EMAIL_PLACEHOLDER}
                                      className="h-11 bg-muted/40 text-muted-foreground border-dashed focus-visible:ring-0 text-base"
                                      error={!!form.formState.errors.email}
                                      {...field}
                                    />
                                </div>
                              </FormControl>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-foreground text-background font-medium">
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
                            <FormLabel className="text-foreground font-semibold text-sm ml-1">{PROFILE_LABELS.ADDRESS}</FormLabel>
                            <FormControl>
                            <InputWithIcon
                                icon={MapPin}
                                placeholder={PROFILE_LABELS.ADDRESS_PLACEHOLDER}
                                error={!!form.formState.errors.address}
                                className="h-11 bg-background/50 focus:bg-background transition-all shadow-sm hover:shadow-md focus:shadow-md text-base"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-border/40 mt-4">
                    <Button
                      type="submit"
                      disabled={isPending || !form.formState.isDirty}
                      size="lg"
                      className="min-w-[160px] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold text-base"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
