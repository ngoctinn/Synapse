"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "../actions";
import { loginSchema, type LoginInput } from "../model/schemas";

import {
    Alert,
    AlertDescription,
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    showToast,
} from "@/shared/ui";
import { PasswordInput } from "@/shared/ui/custom/password-input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const registered = searchParams.get("registered");
  const passwordReset = searchParams.get("password_reset");

  const [state, action, isPending] = useActionState(loginAction, undefined);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    disabled: isPending,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Đăng nhập thành công", "Chào mừng bạn quay trở lại hệ thống.");
      router.push(returnUrl);
    } else if (state?.status === "error") {
      if (state.errors) {
        // Map server errors to react-hook-form fields
        Object.entries(state.errors).forEach(([key, messages]) => {
          form.setError(key as keyof LoginInput, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : (messages as string),
          });
        });
      }
      showToast.error("Đăng nhập thất bại", state.message);
    }
  }, [state, router, returnUrl, form]);

  function onSubmit(values: LoginInput) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin đăng nhập để truy cập hệ thống
        </p>
      </div>

      {registered && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>
            Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
          </AlertDescription>
        </Alert>
      )}
      {passwordReset && (
        <Alert variant="info" className="mb-4">
          <AlertDescription>
            Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
          </AlertDescription>
        </Alert>
      )}

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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline underline-offset-4"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
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
              Đăng nhập
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
