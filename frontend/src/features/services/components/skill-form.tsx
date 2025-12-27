"use client";

import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    showToast,
    Textarea,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, Tag } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createSkill, updateSkill } from "../actions";
import { skillSchema } from "../model/schemas";
import { Skill } from "../model/types";

interface SkillFormProps {
  skill?: Skill;
  onSuccess?: () => void;
}

export function SkillForm({ skill, onSuccess }: SkillFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || "",
      code: skill?.code || "",
      description: skill?.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof skillSchema>) {
    startTransition(async () => {
      try {
        const result = skill
          ? await updateSkill(skill.id, {
              ...values,
              description: values.description || undefined,
            })
          : await createSkill(
              values.name,
              values.code,
              values.description || undefined
            );

        if (result.status === "success") {
          showToast.success(
            skill ? "Cập nhật thành công" : "Tạo mới thành công",
            result.message
          );
          if (onSuccess) {
            onSuccess();
          }
        } else {
          showToast.error("Thất bại", result.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        showToast.error("Lỗi hệ thống", "Có lỗi xảy ra khi lưu kỹ năng");
        console.error(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên kỹ năng</FormLabel>
                <FormControl>
                  <Input
                    startContent={<Tag className="size-4" />}
                    placeholder="VD: Massage Body"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã kỹ năng</FormLabel>
                <FormControl>
                  <Input
                    startContent={<Code className="size-4" />}
                    placeholder="VD: SK_MASSAGE_BODY"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Mã duy nhất, viết hoa, không dấu cách.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về kỹ năng này..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 border-t pt-4">
          <Button type="submit" isLoading={isPending}>
            {skill ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
