"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "../actions";
import { loginSchema, type LoginInput } from "../schemas";

import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
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

export function LoginForm() {
  const router = useRouter();

  // Sử dụng hook useActionState để quản lý trạng thái form server action
  const [state, action, isPending] = useActionState(loginAction, undefined);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Effect để xử lý phản hồi từ server
  useEffect(() => {
    if (state?.success) {
      showToast.success("Đăng nhập thành công", "Chào mừng bạn quay trở lại hệ thống.");
      router.push("/");
    } else if (state?.success === false) {
      showToast.error("Đăng nhập thất bại", state.message);
    }
  }, [state, router]);

  // Hàm xử lý submit form
  function onSubmit(values: LoginInput) {
    const formData = new FormData();
    formData.append("email", values.email);
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
          Chào mừng trở lại
        </h1>
        <p className="text-muted-foreground">
          Nhập thông tin đăng nhập để truy cập hệ thống.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-medium">Email</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={Mail}
                    placeholder="name@example.com"
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
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-foreground/80 font-medium">Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập mật khẩu của bạn"
                    variant="lg"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <Link
                  href="/forgot-password"
                  className="absolute top-0 right-0 text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
            isLoading={isPending}
          >
            Đăng nhập
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4 transition-colors">
          Đăng ký ngay
        </Link>
      </div>
    </motion.div>
  );
}
