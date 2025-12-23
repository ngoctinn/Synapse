"use client";

import { updateProfile } from "@/features/customer-dashboard/actions";
import { PROFILE_MESSAGES } from "@/features/customer-dashboard/constants";
import { ProfileInput, profileSchema } from "@/features/customer-dashboard";
import { UserProfile } from "@/features/customer-dashboard";
import { useReducedMotion } from "@/shared/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  showToast,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, Transition } from "framer-motion";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileInfo } from "./profile-info";

interface ProfileFormProps {
  user: UserProfile;
}

const motionTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    undefined
  );
  const prefersReducedMotion = useReducedMotion();

  // Date limits
  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date();

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
  });

  useEffect(() => {
    if (state?.status === "success") {
      showToast.success(PROFILE_MESSAGES.SUCCESS_TITLE, state.message);
    } else if (state?.status === "error") {
      showToast.error(PROFILE_MESSAGES.ERROR_TITLE, state.message);
    }
  }, [state]);

  const onSubmit = (values: ProfileInput) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.phone) formData.append("phone", values.phone);
    if (values.email) formData.append("email", values.email);
    if (values.address) formData.append("address", values.address);
    if (values.dateOfBirth) formData.append("dateOfBirth", values.dateOfBirth);
    if (values.avatarUrl) formData.append("avatarUrl", values.avatarUrl);

    startTransition(() => {
      formAction(formData);
    });
  };

  // Conditional rendering for reduced motion preference
  const MotionWrapper = prefersReducedMotion ? "div" : motion.div;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: motionTransition,
      };

  return (
    <MotionWrapper
      {...motionProps}
      className="mx-auto w-full max-w-5xl px-4 py-8"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="bg-card dark:bg-card/80 relative overflow-hidden border shadow-sm">
            <CardHeader className="bg-muted/40 border-b px-8 pb-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
                    Hồ sơ cá nhân
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1 text-base">
                    Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
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
    </MotionWrapper>
  );
}
