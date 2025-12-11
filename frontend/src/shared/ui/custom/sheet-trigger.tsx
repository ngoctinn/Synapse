"use client";

import { Button, ButtonProps } from "@/shared/ui/button";
import { LucideIcon } from "lucide-react";
import { ComponentType, ReactNode, useState } from "react";

/**
 * Props cho component Sheet/Dialog
 */
interface SheetComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Props cho SheetTrigger
 */
interface SheetTriggerProps<TSheetProps extends SheetComponentProps> {
  /** Label cho button */
  buttonLabel: string;

  /** Icon cho button (optional) */
  icon?: LucideIcon;

  /** Component Sheet/Dialog để render */
  SheetComponent: ComponentType<TSheetProps>;

  /** Props để truyền vào SheetComponent (không bao gồm open/onOpenChange) */
  sheetProps: Omit<TSheetProps, keyof SheetComponentProps>;

  /** Variant của button */
  buttonVariant?: ButtonProps["variant"];

  /** Size của button */
  buttonSize?: ButtonProps["size"];

  /** Custom className cho button */
  buttonClassName?: string;

  /** Render custom trigger thay vì Button mặc định */
  customTrigger?: (props: { onClick: () => void }) => ReactNode;
}

/**
 * Generic SheetTrigger component.
 * Encapsulates: useState cho open, Button trigger, và Sheet component.
 *
 * @example
 * ```tsx
 * // Sử dụng cơ bản
 * <SheetTrigger
 *   buttonLabel="Mời nhân viên"
 *   icon={Mail}
 *   SheetComponent={StaffSheet}
 *   sheetProps={{ mode: "create", skills }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Với custom trigger
 * <SheetTrigger
 *   buttonLabel="Thêm"
 *   SheetComponent={ResourceSheet}
 *   sheetProps={{ mode: "create", groups }}
 *   customTrigger={({ onClick }) => (
 *     <IconButton onClick={onClick} icon={Plus} />
 *   )}
 * />
 * ```
 */
export function SheetTrigger<TSheetProps extends SheetComponentProps>({
  buttonLabel,
  icon: Icon,
  SheetComponent,
  sheetProps,
  buttonVariant = "default",
  buttonSize = "sm",
  buttonClassName = "text-xs transition-all hover:scale-[1.02] shadow-sm",
  customTrigger,
}: SheetTriggerProps<TSheetProps>) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);

  return (
    <>
      {customTrigger ? (
        customTrigger({ onClick: handleClick })
      ) : (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onClick={handleClick}
        >
          {Icon && <Icon className="mr-2 h-3.5 w-3.5" />}
          {buttonLabel}
        </Button>
      )}

      <SheetComponent
        {...(sheetProps as TSheetProps)}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
