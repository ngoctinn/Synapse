"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { CustomDialog } from "@/shared/ui/custom/dialog";
import { showToast } from "@/shared/ui/custom/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { forgotPasswordAction } from "../actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";

export function ForgotPasswordForm() {

  const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);


  const [state, action, isPending] = useActionState(forgotPasswordAction, undefined);


  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    disabled: isPending,
    defaultValues: {
      email: "",
    },
  });


  useEffect(() => {
    if (state?.status === "success") {
      if (!showCheckEmailDialog) {
          showToast.success("Đã gửi yêu cầu", state.message);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setShowCheckEmailDialog(true);
          form.reset();
      }
    } else if (state?.status === "error") {
      showToast.error("Gửi yêu cầu thất bại", state.message);
    }
  }, [state, form, showCheckEmailDialog]);


  const onSubmit = (values: ForgotPasswordInput) => {
    const formData = new FormData();
    formData.append("email", values.email);


    startTransition(() => {
      action(formData);
    });
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

      <CustomDialog
        open={showCheckEmailDialog}
        onOpenChange={setShowCheckEmailDialog}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => setShowCheckEmailDialog(false),
        }}
        secondaryAction={{
          label: "Gửi lại",
          onClick: () => {
            showToast.info("Đã gửi lại", "Email xác thực mới đã được gửi.");
          },
        }}
      />
    </div>
  );
}
