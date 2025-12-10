"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { CustomDialog } from "@/shared/ui/custom/dialog";
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon";
import { showToast } from "@/shared/ui/custom/sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { forgotPasswordAction } from "../actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";

export function ForgotPasswordForm() {
  // Quản lý trạng thái dialog kiểm tra email
  const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);

  // Sử dụng useActionState để quản lý trạng thái của Server Action
  // initialState là { success: false, message: "" }
  const [state, action, isPending] = useActionState(forgotPasswordAction, {
    success: false,
    message: "",
  });

  // Khởi tạo form với React Hook Form và Zod Resolver
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Xử lý side-effects khi state thay đổi (thành công hoặc thất bại)
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        showToast.success("Đã gửi yêu cầu", state.message);
        setShowCheckEmailDialog(true);
        form.reset();
      } else {
        showToast.error("Gửi yêu cầu thất bại", state.message);
      }
    }
  }, [state, form]);

  // Hàm xử lý submit form
  // Chuyển đổi dữ liệu từ RHF sang FormData để gửi lên Server Action
  const onSubmit = (values: ForgotPasswordInput) => {
    const formData = new FormData();
    formData.append("email", values.email);

    // Gọi action (đã được wrap bởi useActionState)
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">
          Quên mật khẩu?
        </h1>
        <p className="text-muted-foreground">
          Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập.
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

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
            isLoading={isPending}
          >
            Gửi yêu cầu
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Nhớ mật khẩu?{" "}
        <Link
          href="/login"
          className="text-primary font-bold hover:underline underline-offset-4 transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    </motion.div>

      <CustomDialog
        open={showCheckEmailDialog}
        onOpenChange={setShowCheckEmailDialog}
        variant="info"
        icon={Mail}
        title="Kiểm tra email của bạn"
        description="Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn."
        primaryAction={{
          label: "Đã hiểu",
          onClick: () => setShowCheckEmailDialog(false),
        }}
        secondaryAction={{
          label: "Gửi lại",
          onClick: () => {
            // Logic gửi lại có thể gọi lại action hoặc một action khác
            // Ở đây tạm thời chỉ hiện toast thông báo giả lập
            showToast.info("Đã gửi lại", "Email xác thực mới đã được gửi.");
          },
        }}
      />
    </>
  );
}
