"use client";

import { useFormContext } from "react-hook-form";
import { User, Mail, Phone } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/shared/ui";

interface StaffGeneralInfoProps {
  mode: "create" | "update";
}

export function StaffGeneralInfo({ mode }: StaffGeneralInfoProps) {
  const form = useFormContext();
  const control = form.control;

  return (
    <div className="space-y-4">
      {/* Avatar Placeholder */}
      <div className="bg-muted/20 flex items-center gap-4 rounded-xl border p-4">
        <div className="bg-background border-muted-foreground/30 flex size-12 items-center justify-center rounded-full border border-dashed">
          <User className="text-muted-foreground/50 size-6" />
        </div>
        <div className="flex-1">
          <p className="text-foreground text-sm font-medium">Ảnh đại diện</p>
          <p className="text-muted-foreground text-xs">
            Tính năng đang được phát triển.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  startContent={<User className="size-4" />}
                  placeholder="Nguyễn Văn A"
                  {...field}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "create" ? (
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    startContent={<Mail className="size-4" />}
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    startContent={<Phone className="size-4" />}
                    type="tel"
                    placeholder="0912 345 678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả kinh nghiệm, thế mạnh chuyên môn..."
                className="bg-background min-h-24 resize-none focus:ring-1"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
