"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { updatePasswordAction } from "../actions";
import { updatePasswordSchema, type UpdatePasswordInput } from "../schemas";

import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/ui/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

export function UpdatePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, action, isPending] = useActionState(updatePasswordAction, undefined);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    disabled: isPending,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });


  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Cập nhật thành công", state.message);
      form.reset();
    } else if (state?.status === "error") {
      showToast.error("Cập nhật thất bại", state.message);
    }
  }, [state, form]);

  function onSubmit(values: UpdatePasswordInput) {
    const formData = new FormData();
    formData.append("password", values.password);

    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cập nhật mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      }
                      placeholder="Nhập lại mật khẩu mới"
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
              Cập nhật mật khẩu
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
