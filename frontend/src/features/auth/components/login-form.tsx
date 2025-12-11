"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "../actions";
import { loginSchema, type LoginInput } from "../schemas";

import { Button } from "@/shared/ui/button";
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
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const [state, action, isPending] = useActionState(loginAction, undefined);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    if (state?.success) {
      showToast.success("Đăng nhập thành công", "Chào mừng bạn quay trở lại hệ thống.");
      router.push("/");
    } else if (state?.success === false) {
      showToast.error("Đăng nhập thất bại", state.message);
    }
  }, [state, router]);


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
                <FormLabel className="text-foreground/80 font-normal">Email</FormLabel>
                <FormControl>
                  <Input
                    startContent={<Mail className="size-4 text-muted-foreground" />}
                    placeholder="name@example.com"
                    className="bg-background/50 h-10"
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
                  <FormLabel className="text-foreground/80 font-normal">Mật khẩu</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    startContent={<Lock className="size-4 text-muted-foreground" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    }
                    placeholder="Nhập mật khẩu của bạn"
                    className="bg-background/50 h-10"
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
            className="w-full text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
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
