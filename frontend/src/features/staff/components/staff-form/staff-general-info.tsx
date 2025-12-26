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
import { Icon } from "@/shared/ui/custom/icon";
import { Stack, Group, Grid } from "@/shared/ui/layout";

interface StaffGeneralInfoProps {
  mode: "create" | "update";
}

export function StaffGeneralInfo({ mode }: StaffGeneralInfoProps) {
  const form = useFormContext();
  const control = form.control;

  return (
    <Stack gap={4}>
      {/* Avatar Placeholder */}
      <Group align="center" gap={4} className="bg-muted/20 rounded-lg border p-4">
        <div className="bg-background border-muted-foreground/30 flex size-12 items-center justify-center rounded-full border border-dashed text-muted-foreground/50">
          <Icon icon={User} size="xl" strokeWidth={1.5} />
        </div>
        <Stack gap={0} className="flex-1">
          <p className="text-foreground text-sm font-medium">Ảnh đại diện</p>
          <p className="text-muted-foreground text-xs">
            Tính năng đang được phát triển.
          </p>
        </Stack>
      </Group>

      <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  startContent={<Icon icon={User} className="text-muted-foreground/60" />}
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
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    startContent={
                      <Icon icon={Mail} className="text-muted-foreground/60" />
                    }
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
                <FormLabel required>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    startContent={
                      <Icon icon={Phone} className="text-muted-foreground/60" />
                    }
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
      </Grid>

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả kinh nghiệm, thế mạnh chuyên môn..."
                className="bg-background min-h-24 resize-none focus:ring-[1.5px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Stack>
  );
}
