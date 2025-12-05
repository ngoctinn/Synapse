
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { loginAction } from "../actions";

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(8, {
    message: "Mật khẩu phải có ít nhất 8 ký tự.",
  }),
});

export function LoginForm() {
  const router = useRouter();

  // Sử dụng hook useActionState để quản lý trạng thái form server action (Next.js 16)
  const [state, action, isPending] = useActionState(loginAction, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Effect để xử lý phản hồi từ server (Toast & Redirect)
  useEffect(() => {
    if (state?.success) {
      showToast.success("Đăng nhập thành công", "Chào mừng bạn quay trở lại hệ thống.");
      router.push("/");
    } else if (state?.success === false) {
      showToast.error("Đăng nhập thất bại", state.message);
    }
  }, [state, router]);

  // Hàm xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    // Gọi server action thông qua startTransition để cập nhật isPending
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
                <FormLabel className="text-foreground/80">Email</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={Mail}
                    placeholder="name@example.com"
                    className="h-12 bg-background border-input/50 focus:border-primary/50 transition-all"
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
                <FormLabel className="text-foreground/80">Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập mật khẩu của bạn"
                    className="h-12 bg-background border-input/50 focus:border-primary/50 transition-all"
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
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập"
            )}
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
