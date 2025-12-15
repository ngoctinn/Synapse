"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { registerAction } from "../actions";
import { usePasswordVisibility } from "../hooks/use-password-visibility";
import { registerSchema, type RegisterInput } from "../schemas";

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
      router.push("/login?registered=true");
    } else if (state?.status === "error") {
      showToast.error("Đăng ký thất bại", state.message);
    }
  }, [state, router]);

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
    </div>
  );
}
