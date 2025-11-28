
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);

    try {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        showToast.success("Đã gửi yêu cầu", result.message);
        setShowCheckEmailDialog(true);
        form.reset();
      } else {
        showToast.error("Gửi yêu cầu thất bại", "Vui lòng thử lại.");
      }
    } catch {
      showToast.error("Lỗi hệ thống", "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
          <CardDescription>
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
                        placeholder="Nhập email của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
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
            <Link href="/login" className="text-primary hover:underline">
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
            showToast.info("Đã gửi lại", "Email xác thực mới đã được gửi.");
          },
        }}
      />
    </>
  );
}
