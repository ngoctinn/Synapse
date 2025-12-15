"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "../actions";
import { usePasswordVisibility } from "../hooks/use-password-visibility";
import { loginSchema, type LoginInput } from "../schemas";

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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const registered = searchParams.get("registered");
  const passwordReset = searchParams.get("password_reset");
  const { show, toggle, inputType, Icon, ariaLabel } = usePasswordVisibility();

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
      showToast.error("Đăng nhập thất bại", state.message);
    }
  }, [state, router, returnUrl]);

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
        <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <AlertDescription>
            Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
          </AlertDescription>
        </Alert>
      )}
      {passwordReset && (
        <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
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
                    <Input
                      type={inputType}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggle}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={ariaLabel}
                          tabIndex={-1}
                        >
                          <Icon className="size-4" />
                        </button>
                      }
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
