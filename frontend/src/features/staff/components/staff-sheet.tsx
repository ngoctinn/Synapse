"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Send } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Skill } from "@/features/services/types";
import { manageStaff } from "@/features/staff/actions";
import {
    StaffCreateFormValues,
    StaffUpdateFormValues,
    staffCreateSchema,
    staffUpdateSchema,
} from "@/features/staff/model/schemas";
import { Staff } from "@/features/staff/model/types";

import {
    Button,
    Form,
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    showToast
} from "@/shared/ui";
import { StaffForm } from "./staff-form";

/** Union type cho cả Create và Update form values */
type StaffFormValues = StaffCreateFormValues | StaffUpdateFormValues;

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
  const [state, dispatch, isPending] = React.useActionState(
    manageStaff,
    undefined
  );

  const schema = mode === "create" ? staffCreateSchema : staffUpdateSchema;

  const form = useForm<StaffCreateFormValues | StaffUpdateFormValues>({
    resolver: zodResolver(schema),
    disabled: isPending,
    defaultValues: {
      email: "",
      full_name: "",
      role: "technician",
      title: "",
      skill_ids: [],
    },
  });

  React.useEffect(() => {
    if (state?.status === "success" && state.message) {
      showToast.success(
        mode === "create" ? "Đã gửi lời mời" : "Cập nhật thành công",
        state.message
      );
      onOpenChange(false);
    } else if (state?.status === "error") {
      showToast.error("Thất bại", state.message);
    }
  }, [state, mode, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      form.reset(
        mode === "create"
          ? {
              email: "",
              full_name: "",
              role: "technician",
              title: "",
              skill_ids: [],
            }
          : {
              full_name: staff?.user.full_name || "",
              phone_number: staff?.user.phone_number || "",
              role: staff?.user.role === 'customer' ? 'technician' : staff?.user.role || 'technician',
              title: staff?.title || "",
              bio: staff?.bio || "",
              color_code: staff?.color_code || "#3B82F6",
              skill_ids: staff?.skills.map((s) => s.id) || [],
              hired_at: staff?.hired_at ? staff.hired_at.split("T")[0] : "", // Simple date format
              commission_rate: staff?.commission_rate || 0,
            }
      );
    }
  }, [open, mode, staff, form]);

  function onSubmit(data: StaffFormValues) {
    const formData = new FormData();

    formData.append("form_mode", mode);
    if (staff?.user_id) formData.append("staff_id", staff.user_id);

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'number') {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    React.startTransition(() => {
      dispatch(formData);
    });
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {mode === "create" ? "Mời nhân viên" : "Hồ sơ nhân viên"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area" id="sheet-scroll-container">
          <Form {...form}>
            <form
              id="staff-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <StaffForm mode={mode} skills={skills} />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => !isPending && onOpenChange(false)}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="staff-form"
            disabled={isPending}
            className="min-w-[140px]"
            isLoading={isPending}
            startContent={
              mode === "create" ? (
                <Send className="size-4" />
              ) : (
                <Save className="size-4" />
              )
            }
          >
            {mode === "create" ? "Gửi lời mời" : "Lưu thay đổi"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
