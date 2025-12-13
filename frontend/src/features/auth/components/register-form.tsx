"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react"; // Removed useRef, useState
import { useForm } from "react-hook-form";

import { registerAction, resendVerificationAction } from "../actions";
import { usePasswordVisibility } from "../hooks/use-password-visibility";
import { registerSchema, type RegisterInput } from "../schemas";

import { ConfirmDialog } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { showToast } from "@/shared/ui/sonner";

export function RegisterForm() {
  const [state, action, isPending] = useActionState(registerAction, undefined);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    disabled: isPending,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Effect to show toast messages
  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Đăng ký thành công", state.message);
    } else if (state?.status === "error") {
      showToast.error("Đăng ký thất bại", state.message);
    }
  }, [state]);

  function onSubmit(values: RegisterInput) {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    startTransition(() => {
      action(formData);
    });
  }

  const handleResend = async () => {
    const currentEmail = form.getValues("email");
    if (!currentEmail) return;
    const resendState = await resendVerificationAction(currentEmail);
    if (resendState.status === "success") {
      showToast.success("Gửi lại thành công", resendState.message);
    } else {
      showToast.error("Gửi lại thất bại", resendState.message);
    }
  };

  // Refactored usePasswordVisibility destructuring
  const { toggle: togglePassword, inputType: passwordInputType, Icon: PasswordToggleIcon, ariaLabel: passwordAriaLabel } = usePasswordVisibility();
  const { toggle: toggleConfirmPassword, inputType: confirmPasswordInputType, Icon: ConfirmPasswordToggleIcon, ariaLabel: confirmPasswordAriaLabel } = usePasswordVisibility();

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tạo tài khoản mới
        </h1>
        <p className="text-sm text-muted-foreground">
          Trải nghiệm dịch vụ chuyên nghiệp ngay hôm nay
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      startContent={<User className="size-4 text-muted-foreground" />}
                      placeholder="Nhập họ và tên"
                      autoComplete="name"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      startContent={<Mail className="size-4 text-muted-foreground" />}
                      placeholder="name@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordInputType}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={passwordAriaLabel}
                          tabIndex={-1}
                        >
                          <PasswordToggleIcon className="size-4" />
                        </button>
                      }
                      placeholder="Tối thiểu 8 ký tự"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type={confirmPasswordInputType}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleConfirmPassword}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={confirmPasswordAriaLabel}
                          tabIndex={-1}
                        >
                          <ConfirmPasswordToggleIcon className="size-4" />
                        </button>
                      }
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              Đăng ký
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Đăng nhập ngay
        </Link>
      </p>

      <ConfirmDialog
        open={state?.status === "success"}
        onOpenChange={(open) => {
          if (!open) { // Dialog is closing
            form.reset(); // Reset form when dialog closes
            // No need to clear registeredEmail as it's not state managed here
          }
        }}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết xác thực đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn để hoàn tất đăng ký."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => {
            // This onClick is redundant if open is derived from state
            // When this closes the dialog, onOpenChange will be called.
          },
        }}
        secondaryAction={{
          label: "Gửi lại",
          onClick: handleResend,
        }}
      />
    </div>
  );
}