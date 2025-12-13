"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

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
import { forgotPasswordAction } from "../actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";

export function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, undefined);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    disabled: isPending,
    defaultValues: {
      email: "",
    },
  });

  // Effect to show toast messages
  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Đã gửi yêu cầu", state.message);
    } else if (state?.status === "error") {
      showToast.error("Gửi yêu cầu thất bại", state.message);
    }
  }, [state]);

  const onSubmit = (values: ForgotPasswordInput) => {
    const formData = new FormData();
    formData.append("email", values.email);

    startTransition(() => {
      action(formData);
    });
  };

  const handleResend = () => {
    const currentEmail = form.getValues("email");
    if (currentEmail) {
      const formData = new FormData();
      formData.append("email", currentEmail);
      startTransition(() => {
        action(formData);
      });
      showToast.info("Đã gửi lại", "Email đặt lại mật khẩu mới đã được gửi.");
    } else {
      showToast.error("Lỗi", "Không tìm thấy email để gửi lại.");
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              Gửi yêu cầu
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nhớ mật khẩu?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Đăng nhập
        </Link>
      </p>

      <ConfirmDialog
        open={state?.status === "success"}
        onOpenChange={(open) => {
          if (!open) {
             form.reset(); // Reset form when dialog closes
          }
        }}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => {
            // This onClick is redundant if open is derived from state
            // But if it's there for explicit user action, keep it.
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
