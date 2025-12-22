"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { registerAction } from "../actions";
import { registerSchema, type RegisterInput } from "../model/schemas";

import {
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

export function RegisterForm() {
  const router = useRouter();
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

  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Đăng ký thành công", state.message);
      // Success state UI would be handled by visual feedback or redirect
      router.push("/login?registered=true");
    } else if (state?.status === "error") {
      if (state.errors) {
        // Map server errors to react-hook-form fields
        Object.entries(state.errors).forEach(([key, messages]) => {
          form.setError(key as keyof RegisterInput, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : (messages as string),
          });
        });
      }
      showToast.error("Đăng ký thất bại", state.message);
    }
  }, [state, router, form]);

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



  if (state?.status === "success") {
    return (
      <div className="w-full animate-fade-in text-center space-y-6 py-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-2">
            <Mail className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kiểm tra email của bạn</h1>
          <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
            Chúng tôi đã gửi một liên kết xác thực đến <strong>{form.getValues("email")}</strong>.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Quay lại đăng nhập</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Không nhận được email? <button className="text-primary hover:underline" onClick={() => window.location.reload()}>Thử lại</button>
          </p>
        </div>
      </div>
    );
  }

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
                    <PasswordInput
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
                    <PasswordInput
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
    </div>
  );
}
