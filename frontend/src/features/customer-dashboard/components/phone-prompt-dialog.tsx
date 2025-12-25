"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { phoneVNOptional } from "@/shared/lib/validations";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  showToast,
} from "@/shared/ui";

import { updateProfile } from "../actions";
import { UserProfile } from "../model/types";

const phoneSchema = z.object({
  phone_number: phoneVNOptional,
});

type PhoneInput = z.infer<typeof phoneSchema>;

interface PhonePromptDialogProps {
  user: UserProfile;
}

const STORAGE_KEY = "phone_prompt_skipped";

export function PhonePromptDialog({ user }: PhonePromptDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    undefined
  );

  const form = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone_number: "",
    },
  });

  // Kiểm tra xem có cần hiển thị dialog không
  useEffect(() => {
    // Chỉ hiển thị nếu user chưa có SĐT và chưa bỏ qua trong session này
    const skipped = sessionStorage.getItem(STORAGE_KEY);
    if (!user.phone_number && !skipped) {
      // Delay một chút để user có thể thấy dashboard trước
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user.phone_number]);

  // Xử lý khi submit thành công
  useEffect(() => {
    if (state?.status === "success") {
      showToast.success("Thành công", "Số điện thoại đã được cập nhật");
      setOpen(false);
    } else if (state?.status === "error") {
      showToast.error("Lỗi", state.message);
    }
  }, [state]);

  const onSubmit = (values: PhoneInput) => {
    if (!values.phone_number) return;

    const formData = new FormData();
    formData.append("fullName", user.fullName);
    formData.append("phone_number", values.phone_number);

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleSkip = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  // Không render nếu đã có SĐT
  if (user.phone_number) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật số điện thoại</DialogTitle>
          <DialogDescription>
            Vui lòng cung cấp số điện thoại để chúng tôi có thể liên hệ khi cần.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      startContent={
                        <Phone className="text-muted-foreground h-4 w-4" />
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isPending}
              >
                Để sau
              </Button>
              <Button
                type="submit"
                disabled={!form.watch("phone_number")}
                isLoading={isPending}
              >
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
