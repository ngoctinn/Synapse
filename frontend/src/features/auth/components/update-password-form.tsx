"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { updatePasswordAction } from "../actions";
import { usePasswordVisibility } from "../hooks/use-password-visibility";
import { updatePasswordSchema, type UpdatePasswordInput } from "../schemas";

import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    showToast,
} from "@/shared/ui";

export function UpdatePasswordForm() {
  const router = useRouter();

  const { show: showPassword, toggle: togglePassword, inputType: passwordInputType, Icon: PasswordIcon, ariaLabel: passwordAriaLabel } = usePasswordVisibility();
  const { show: showConfirmPassword, toggle: toggleConfirmPassword, inputType: confirmPasswordInputType, Icon: ConfirmPasswordIcon, ariaLabel: confirmPasswordAriaLabel } = usePasswordVisibility();

  const [state, action, isPending] = useActionState(updatePasswordAction, undefined);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    disabled: isPending,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Cập nhật thành công", state.message);
      form.reset();
      router.push("/login"); // UX-04: Redirect to login after successful password update
    } else if (state?.status === "error") {
      showToast.error("Cập nhật thất bại", state.message);
    }
  }, [state, form, router]);

  function onSubmit(values: UpdatePasswordInput) {
    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword); // Validated on server as well

    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cập nhật mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordInputType}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={passwordAriaLabel}
                          tabIndex={-1}
                        >
                          <PasswordIcon className="size-4" />
                        </button>
                      }
                      placeholder="Tối thiểu 8 ký tự"
                      autoComplete="new-password"
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
                    <Input
                      type={confirmPasswordInputType}
                      startContent={<Lock className="size-4 text-muted-foreground" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleConfirmPassword}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={confirmPasswordAriaLabel}
                          tabIndex={-1}
                        >
                          <ConfirmPasswordIcon className="size-4" />
                        </button>
                      }
                      placeholder="Nhập lại mật khẩu mới"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              Cập nhật mật khẩu
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
