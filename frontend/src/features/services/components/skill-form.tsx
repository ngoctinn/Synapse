"use client";

import { Button } from "@/shared/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createSkill, updateSkill } from "../actions";
import { skillSchema } from "../schemas";
import { Skill } from "../types";

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
          ? await updateSkill(skill.id, values)
          : await createSkill(values);

        if (result.success) {
          toast.success(skill ? "Cập nhật kỹ năng thành công" : "Tạo kỹ năng thành công");
          if (onSuccess) {
            onSuccess();
          }
        } else {
          toast.error(result.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lưu kỹ năng");
        console.error(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tên kỹ năng</FormLabel>
                <FormControl>
                    <Input placeholder="VD: Massage Body" {...field} />
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
                    <Input placeholder="VD: SK_MASSAGE_BODY" {...field} />
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

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {skill ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
