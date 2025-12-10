"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { updatePasswordAction } from "../actions";
import { updatePasswordSchema, type UpdatePasswordInput } from "../schemas";

import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/custom/password-input";
import { showToast } from "@/shared/ui/custom/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

export function UpdatePasswordForm() {
  // Sử dụng hook useActionState để quản lý trạng thái form server action
  const [state, action, isPending] = useActionState(updatePasswordAction, undefined);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Effect để xử lý phản hồi từ server
  useEffect(() => {
    if (state?.success) {
      showToast.success("Cập nhật thành công", state.message);
      form.reset();
    } else if (state?.success === false) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">
          Cập nhật mật khẩu
        </h1>
        <p className="text-muted-foreground">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-medium">Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập mật khẩu mới"
                    variant="lg"
                    className="bg-background/50"
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
                <FormLabel className="text-foreground/80 font-medium">Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập lại mật khẩu mới"
                    variant="lg"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
            isLoading={isPending}
          >
            Cập nhật mật khẩu
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4 transition-colors">
          Quay lại đăng nhập
        </Link>
      </div>
    </motion.div>
  );
}
