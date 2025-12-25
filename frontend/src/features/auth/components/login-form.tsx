"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { loginAction, signInWithGoogle } from "../actions";
import { loginSchema, type LoginInput } from "../model/schemas";
import { cn } from "@/shared/lib/utils";

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

// Google Icon SVG Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const registered = searchParams.get("registered");
  const passwordReset = searchParams.get("password_reset");

  const [state, action, isPending] = useActionState(loginAction, undefined);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    disabled: isPending || isGoogleLoading,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.status === "success") {
      showToast.success(
        "Đăng nhập thành công",
        "Chào mừng bạn quay trở lại hệ thống."
      );
      router.push(returnUrl);
    } else if (state?.status === "error") {
      if (state.errors) {
        // Map server errors to react-hook-form fields
        Object.entries(state.errors).forEach(([key, messages]) => {
          form.setError(key as keyof LoginInput, {
            type: "server",
            message: Array.isArray(messages)
              ? messages[0]
              : (messages as string),
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

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.status === "success" && result.data?.url) {
        // Redirect to Google OAuth
        window.location.href = result.data.url;
      } else {
        showToast.error("Lỗi đăng nhập", result.message || "Không thể kết nối với Google");
        setIsGoogleLoading(false);
      }
    } catch {
      showToast.error("Lỗi đăng nhập", "Đã xảy ra lỗi không mong muốn");
      setIsGoogleLoading(false);
    }
  }

  const isLoading = isPending || isGoogleLoading;

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Chào mừng trở lại
        </h1>
        <p className="text-muted-foreground text-sm">
          Nhập thông tin đăng nhập để truy cập hệ thống
        </p>
      </div>

      {registered && (
        <Alert variant="success" className="animate-in zoom-in-95 mb-4 duration-300">
          <AlertDescription>
            Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
          </AlertDescription>
        </Alert>
      )}
      {passwordReset && (
        <Alert variant="info" className="animate-in zoom-in-95 mb-4 duration-300">
          <AlertDescription>
            Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
          </AlertDescription>
        </Alert>
      )}

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full mb-4"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        isLoading={isGoogleLoading}
      >
        {!isGoogleLoading && <GoogleIcon className="size-5 mr-2" />}
        Đăng nhập bằng Google
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Hoặc đăng nhập bằng email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    startContent={
                      <Mail className="text-muted-foreground size-4" />
                    }
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
                  <FormLabel required>Mật khẩu</FormLabel>
                  <Link
                    href={isLoading ? "#" : "/forgot-password"}
                    className={cn(
                      "text-primary text-xs underline-offset-4 hover:underline",
                      isLoading && "pointer-events-none opacity-50"
                    )}
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

          <Button type="submit" className="w-full" isLoading={isPending} disabled={isLoading}>
            Đăng nhập
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

