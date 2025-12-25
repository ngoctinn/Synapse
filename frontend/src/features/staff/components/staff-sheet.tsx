"use client";

import { Save, Send } from "lucide-react";
import * as React from "react";

import { Skill } from "@/features/services/model/types";
import { manageStaff } from "@/features/staff/actions";
import {
  StaffCreateFormValues,
  StaffUpdateFormValues,
  staffCreateSchema,
  staffUpdateSchema,
} from "@/features/staff/model/schemas";
import { Staff } from "@/features/staff/model/types";
import { useSheetForm } from "@/shared/hooks/use-sheet-form";
import { Button, Form } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
import { StaffForm } from "./staff-form";

interface StaffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  staff?: Staff;
  skills: Skill[];
}

export function StaffSheet({
  open,
  onOpenChange,
  mode,
  staff,
  skills,
}: StaffSheetProps) {
  const schema = mode === "create" ? staffCreateSchema : staffUpdateSchema;

  const { form, isPending, onSubmit, isDirty } = useSheetForm<
    StaffCreateFormValues | StaffUpdateFormValues,
    Staff
  >({
    schema,
    open,
    data: staff,
    defaultValues: {
      email: "",
      full_name: "",
      role: "technician",
      title: "",
      skill_ids: [],
    },
    transformData: (data) => ({
      full_name: data.user.full_name || "",
      phone_number: data.user.phone_number || "",
      role: data.user.role === "customer" ? "technician" : (data.user.role as any) || "technician",
      title: data.title || "",
      bio: data.bio || "",
      color_code: data.color_code || "#3B82F6",
      skill_ids: data.skills.map((s) => s.id) || [],
      hired_at: data.hired_at ? data.hired_at.split("T")[0] : "",
      commission_rate: data.commission_rate || 0,
    }),
    action: async (values) => {
      const formData = new FormData();
      formData.append("form_mode", mode);
      if (staff?.user_id) formData.append("staff_id", staff.user_id);

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      return manageStaff(undefined, formData);
    },
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: mode === "create" ? "Đã gửi lời mời thành công" : "Cập nhật thành công",
    },
  });

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Mời nhân viên" : "Hồ sơ nhân viên"}
      description={
        mode === "create"
          ? "Mời nhân viên mới tham gia hệ thống"
          : "Xem và chỉnh sửa thông tin nhân viên"
      }
      isPending={isPending}
      isDirty={isDirty}
      footer={
        <>
          <ActionSheetClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className="min-w-[100px]"
            >
              Hủy
            </Button>
          </ActionSheetClose>
          <Button
            type="submit"
            form="staff-form"
            isLoading={isPending}
            startContent={<Icon icon={mode === "create" ? Send : Save} />}
          >
            {mode === "create" ? "Gửi lời mời" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id="staff-form" onSubmit={onSubmit} className="space-y-6">
          <StaffForm mode={mode} skills={skills} />
        </form>
      </Form>
    </ActionSheet>
  );
}

// Trick để dùng SheetClose (đã được export từ @/shared/ui nhưng muốn dùng alias trong context ActionSheet)
import { SheetClose as ActionSheetClose } from "@/shared/ui/sheet";
