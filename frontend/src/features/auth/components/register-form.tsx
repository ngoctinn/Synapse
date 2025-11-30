
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
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
import { CustomDialog } from "@/shared/ui/custom/dialog";
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
import { registerAction } from "../actions";

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Họ tên phải có ít nhất 2 ký tự.",
    }),
    email: z.string().email({
      message: "Email không hợp lệ.",
    }),
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);
  
  // Sử dụng hook useActionState để quản lý trạng thái form server action
  const [state, action, isPending] = useActionState(registerAction, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Effect để xử lý phản hồi từ server
  useEffect(() => {
    if (state?.success) {
      showToast.success("Đăng ký thành công", state.message);
      setShowCheckEmailDialog(true);
      form.reset();
    } else if (state?.success === false) {
      showToast.error("Đăng ký thất bại", state.message);
    }
  }, [state, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
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
      <Card className="w-full shadow-lg border-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <InputWithIcon
                        icon={User}
                        placeholder="Nhập họ và tên của bạn"
                        className="h-11"
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
                      <InputWithIcon
                        icon={Mail}
                        placeholder="Nhập email của bạn"
                        className="h-11"
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
                        placeholder="Nhập mật khẩu của bạn"
                        className="h-11"
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
                        placeholder="Nhập lại mật khẩu của bạn"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full h-11 font-medium transition-all hover:scale-[1.02]" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4 transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
        </CardFooter>
      </Card>

      <CustomDialog
        open={showCheckEmailDialog}
        onOpenChange={setShowCheckEmailDialog}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết xác thực đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn để hoàn tất đăng ký."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => setShowCheckEmailDialog(false),
        }}
        secondaryAction={{
          label: "Gửi lại",
          onClick: () => {
            showToast.info("Đã gửi lại", "Email xác thực mới đã được gửi.");
          },
        }}
      />
    </motion.div>
  );
}
