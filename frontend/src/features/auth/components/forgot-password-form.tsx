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
  const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);
  const [lastEmailSent, setLastEmailSent] = useState<string | null>(null);

  const [state, action, isPending] = useActionState(forgotPasswordAction, undefined);

  const dismissedStateRef = useRef<typeof state>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    disabled: isPending,
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (state?.status === "success" && state !== dismissedStateRef.current) {
      showToast.success("Đã gửi yêu cầu", state.message);
      setShowCheckEmailDialog(true);
      setLastEmailSent(form.getValues("email"));
    } else if (state?.status === "error" && state !== dismissedStateRef.current) {
      showToast.error("Gửi yêu cầu thất bại", state.message);
      dismissedStateRef.current = state;
    }
  }, [state, form]);

  const onSubmit = (values: ForgotPasswordInput) => {
    const formData = new FormData();
    formData.append("email", values.email);

    startTransition(() => {
      action(formData);
    });
  };

  const handleResend = () => {
    if (lastEmailSent) {
      const formData = new FormData();
      formData.append("email", lastEmailSent);
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
        open={showCheckEmailDialog}
        onOpenChange={(open) => {
          setShowCheckEmailDialog(open);
          if (!open) {
             dismissedStateRef.current = state;
          }
        }}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => {
            setShowCheckEmailDialog(false);
            form.reset(); // UX-02: Reset form after dialog close
            setLastEmailSent(null); // Clear last sent email
            dismissedStateRef.current = state;
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
