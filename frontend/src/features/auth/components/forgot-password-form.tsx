"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";

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
      <Card className="w-full shadow-lg border-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Quên mật khẩu</CardTitle>
          <CardDescription className="text-muted-foreground">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
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
                        placeholder="name@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 font-medium transition-all hover:scale-[1.02]" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            Nhớ mật khẩu?{" "}
            <Link 
              href="/login" 
              className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
            >
              Đăng nhập
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
