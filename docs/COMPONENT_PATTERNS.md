# Component Patterns - Dự Án Synapse

> **Tài liệu này mô tả các patterns chuẩn hóa cho việc phát triển component trong dự án Synapse.**
> Cập nhật lần cuối: 2025-12-15

---

## 1. Import Pattern

### ✅ Đúng Chuẩn: Barrel Import
```tsx
// Import tất cả từ @/shared/ui
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  TableRowActions,
  DeleteConfirmDialog,
} from "@/shared/ui";
```

### ❌ Sai: Deep Import
```tsx
// KHÔNG SỬ DỤNG - Deep import vi phạm FSD
import { Button } from "@/shared/ui/button";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";
import { Dialog } from "@/shared/ui/dialog";
```

---

## 2. Dialog System

### Quyết Định Thiết Kế
Dự án sử dụng **2 loại Dialog chuẩn từ Shadcn/UI**:

| Component | Khi nào dùng |
|-----------|--------------|
| **Dialog** | Modal thông thường (form, details, settings) |
| **AlertDialog** | Xác nhận hành động nguy hiểm/quan trọng |

### Ví dụ: AlertDialog cho Xác Nhận Xóa
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui";

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Xóa
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### Ví dụ: DeleteConfirmDialog (Wrapper Tiện Lợi)
```tsx
import { DeleteConfirmDialog } from "@/shared/ui";
import { useDeleteAction } from "@/shared/hooks";

function EntityActions({ entity }: { entity: Entity }) {
  const { handleDelete, dialogProps, openDeleteDialog } = useDeleteAction({
    deleteAction: deleteEntity,
    entityName: "thực thể",
    refreshOnSuccess: true,
  });

  return (
    <>
      <Button variant="destructive" onClick={openDeleteDialog}>
        Xóa
      </Button>

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(entity.id)}
        entityName="thực thể"
        entityLabel={entity.name}
      />
    </>
  );
}
```

---

## 3. Table Actions Pattern

### Cấu trúc Tiêu Chuẩn
```tsx
import { useDeleteAction } from "@/shared/hooks";
import { DeleteConfirmDialog, TableRowActions } from "@/shared/ui";

interface EntityActionsProps {
  entity: Entity;
  onEdit: () => void;
}

export function EntityActions({ entity, onEdit }: EntityActionsProps) {
  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteEntity,
      entityName: "tên entity tiếng Việt",
      refreshOnSuccess: true,
    });

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={openDeleteDialog}
        disabled={isPending}
      />

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(entity.id)}
        entityName="tên entity tiếng Việt"
        entityLabel={entity.name}
      />
    </>
  );
}
```

---

## 4. Sheet Pattern (Form Side Panel)

### Cấu trúc Tiêu Chuẩn
```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { manageEntity } from "@/features/entity/actions";
import { EntityFormValues, entitySchema } from "@/features/entity/schemas";
import { Entity } from "@/features/entity/types";
import { Button, Form, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, showToast } from "@/shared/ui";
import { Save } from "lucide-react";
import { EntityForm } from "./entity-form";

interface EntitySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  entity?: Entity;
}

export function EntitySheet({ open, onOpenChange, mode, entity }: EntitySheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageEntity, undefined);

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
    disabled: isPending,
    defaultValues: { /* ... */ },
  });

  // Handle success/error states
  React.useEffect(() => {
    if (state?.status === "success" && state.message) {
      showToast.success(mode === "create" ? "Tạo thành công" : "Cập nhật thành công", state.message);
      onOpenChange(false);
    } else if (state?.status === "error") {
      showToast.error("Thất bại", state.message);
    }
  }, [state, mode, onOpenChange]);

  // Reset form when sheet opens
  React.useEffect(() => {
    if (open) {
      form.reset(mode === "create" ? { /* defaults */ } : { /* entity data */ });
    }
  }, [open, mode, entity, form]);

  const onSubmit = (data: EntityFormValues) => {
    const formData = new FormData();
    // ... build formData
    React.startTransition(() => dispatch(formData));
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col">
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "Tạo mới" : "Cập nhật"}</SheetTitle>
          <SheetDescription>Mô tả ngắn...</SheetDescription>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <Form {...form}>
            <form id="entity-form" onSubmit={form.handleSubmit(onSubmit)}>
              <EntityForm mode={mode} />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="entity-form" isLoading={isPending}>
            <Save className="size-4 mr-2" />
            Lưu
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

---

## 5. Form Validation Pattern

### Sử dụng Shared Validations
```tsx
import {
  emailRequired,
  fullNameRequired,
  phoneVNRequired,
  dateOfBirthOptional,
  colorHexOptional,
} from "@/shared/lib/validations";
import { z } from "zod";

export const entitySchema = z.object({
  full_name: fullNameRequired,
  email: emailRequired,
  phone_number: phoneVNRequired,
  date_of_birth: dateOfBirthOptional,
  color_code: colorHexOptional,
  // Custom fields
  custom_field: z.string().min(1, "Trường này bắt buộc"),
});

export type EntityFormValues = z.infer<typeof entitySchema>;
```

### Quy Tắc Nghiệp Vụ Chuẩn Hóa

| Trường | Quy Tắc |
|--------|---------|
| `full_name` | min(2), max(50) |
| `email` | z.string().email() |
| `phone_number` | Regex VN: `/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/` |
| `date_of_birth` | year >= 1900, date <= today |
| `password` | min(8) |
| `color_code` | Hex: `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/` |

---

## 6. Naming Conventions

### Admin Modules vs Customer Portal

| Ngữ cảnh | Convention | Ví dụ |
|----------|------------|-------|
| Admin (Backend compatible) | `snake_case` | `phone_number`, `date_of_birth` |
| Customer Portal | `camelCase` | `phone`, `dateOfBirth` |

### File Naming

| Loại | Convention | Ví dụ |
|------|------------|-------|
| Component | `kebab-case.tsx` | `entity-table.tsx` |
| Hook | `use-*.ts` | `use-delete-action.ts` |
| Schema | `schemas.ts` | `features/entity/schemas.ts` |
| Types | `types.ts` | `features/entity/types.ts` |
| Actions | `actions.ts` | `features/entity/actions.ts` |

---

## 7. Hooks Tiêu Chuẩn

| Hook | Mục đích |
|------|----------|
| `useDeleteAction` | Xử lý xóa entity với confirmation dialog |
| `useSheetForm` | Quản lý state cho form trong Sheet |
| `useActionState` | React 19 - Server Actions + form state |
| `useTableParams` | Query params cho table (search, sort, pagination) |
| `useTableSelection` | Row selection cho DataTable |
| `useBulkAction` | Xử lý bulk operations |

---

## 8. Checklist Trước Khi Commit

- [ ] Tất cả imports sử dụng barrel export `@/shared/ui`
- [ ] Không có deep imports (`@/shared/ui/button`, v.v.)
- [ ] Schema sử dụng shared validations khi có thể
- [ ] Thông báo lỗi bằng Tiếng Việt
- [ ] `pnpm lint` pass (0 errors)
- [ ] `pnpm build` pass
- [ ] Component có TypeScript types đầy đủ
