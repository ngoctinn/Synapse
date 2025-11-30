"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
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
import { updatePasswordAction } from "../actions";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export function UpdatePasswordForm() {
  // Sử dụng hook useActionState để quản lý trạng thái form server action
  const [state, action, isPending] = useActionState(updatePasswordAction, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
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
      <Card className="w-full shadow-lg border-none bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cập nhật mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu mới cho tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Nhập mật khẩu mới"
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
                      <PasswordInput
                        placeholder="Nhập lại mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full transition-all hover:scale-[1.02]" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
