"use client"

import { updateProfile } from "@/features/customer-dashboard/actions"
import { PROFILE_MESSAGES } from "@/features/customer-dashboard/constants"
import { ProfileInput, profileSchema } from "@/features/customer-dashboard/schemas"
import { UserProfile } from "@/features/customer-dashboard/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form } from "@/shared/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ProfileAvatar } from "./profile-avatar"
import { ProfileInfo } from "./profile-info"

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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="border-0 shadow-2xl bg-white/40 backdrop-blur-xl ring-1 ring-black/5 dark:bg-zinc-900/40 dark:ring-white/10 overflow-hidden">
            <CardHeader className="pb-8 border-b border-white/10 bg-white/10 px-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                    Hồ sơ cá nhân
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground mt-1">
                    Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                {/* Left Column: Avatar & Identity */}
                <ProfileAvatar user={user} control={form.control} />

                {/* Right Column: Form Fields */}
                <ProfileInfo
                  form={form}
                  isPending={isPending}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  )
}
