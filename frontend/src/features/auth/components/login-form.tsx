
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để truy cập hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputWithIcon
                        icon={Mail}
                        placeholder="Nhập email của bạn"
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
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput
                        placeholder="Nhập mật khẩu của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
