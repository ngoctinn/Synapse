"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { LucideIcon, LucideProps } from "lucide-react";
import * as React from "react";

interface MaskedDateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "size"
> {
  value?: Date;
  onChange?: (date?: Date) => void;
  icon?: LucideIcon;
  iconProps?: LucideProps;
  error?: boolean | string;
  onInvalidInput?: (isInvalid: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const MaskedDateInput = React.forwardRef<
  HTMLInputElement,
  MaskedDateInputProps
>(
  (
    {
      value,
      onChange,
      className,
      onInvalidInput,
      minDate,
      maxDate,
      icon: Icon,
      iconProps,
      error,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Đồng bộ state nội bộ với prop value
    React.useEffect(() => {
      if (value && !isNaN(value.getTime())) {
        const d = value.getDate().toString().padStart(2, "0");
        const m = (value.getMonth() + 1).toString().padStart(2, "0");
        const y = value.getFullYear().toString();
        setInputValue(`${d}/${m}/${y}`);
      } else if (value === undefined) {
        // Chỉ clear nếu giá trị hiện tại hợp lệ hoặc rỗng
        const parts = inputValue.split("/");
        if (
          inputValue === "" ||
          (parts.length === 3 &&
            !isNaN(Date.parse(`${parts[2]}-${parts[1]}-${parts[0]}`)))
        ) {
          setInputValue("");
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const [isShaking, setIsShaking] = React.useState(false);

    const validateDate = (val: string) => {
      const digits = val.replace(/\D/g, "");

      // Case 1: Empty input
      if (digits.length === 0) {
        onChange?.(undefined);
        onInvalidInput?.(false);
        return;
      }

      // Case 2: Full 8 digits
      if (digits.length === 8) {
        const day = parseInt(digits.slice(0, 2));
        const month = parseInt(digits.slice(2, 4));
        const year = parseInt(digits.slice(4, 8));

        if (month >= 1 && month <= 12) {
          const maxDayOfMonth = new Date(year, month, 0).getDate();
          if (day >= 1 && day <= maxDayOfMonth) {
            const newDate = new Date(year, month - 1, day);

            let isValidRange = true;
            if (minDate && newDate < minDate) isValidRange = false;
            if (maxDate && newDate > maxDate) isValidRange = false;

            // Always emit the date if it's a valid calendar date
            onChange?.(newDate);
            onInvalidInput?.(!isValidRange);
            return;
          }
        }
        // Structurally invalid date (e.g. 40/40/2000)
        onChange?.(new Date(NaN));
        onInvalidInput?.(true);
        triggerShake();
      } else {
        // Case 3: Incomplete input
        onChange?.(new Date(NaN));
        onInvalidInput?.(true);
      }
    };

    const triggerShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const input = e.currentTarget;
        const selectionStart = input.selectionStart;
        const val = input.value;

        // Nếu con trỏ đang ở ngay sau dấu / (vị trí 3 hoặc 6), xóa luôn cả số trước đó
        if (selectionStart === 3 || selectionStart === 6) {
          e.preventDefault();
          const newVal =
            val.slice(0, selectionStart - 2) + val.slice(selectionStart);
          setInputValue(newVal);
          validateDate(newVal);

          // Cập nhật con trỏ
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(
                selectionStart - 2,
                selectionStart - 2
              );
            }
          });
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      // 1. Sanitize: Prevent double slashes and non-allowed chars immediately
      val = val.replace(/[^0-9/]/g, "");
      val = val.replace(/\/+/g, "/"); // Replace multiple slashes with single slash

      const lastChar = val.slice(-1);
      const digits = val.replace(/\D/g, "");

      // 2. Auto-pad 0 logic (User types 1/ -> 01/)
      if (lastChar === "/" && (digits.length === 1 || digits.length === 3)) {
        if (digits.length === 1) {
          val = `0${digits}/`;
        } else if (digits.length === 3) {
          val = `${digits.slice(0, 2)}/0${digits.slice(2)}/`;
        }
      }

      // Re-calculate digits after auto-pad
      const currentDigits = val.replace(/\D/g, "");

      // 3. Robust Formatting Logic
      let formattedVal = "";

      if (currentDigits.length > 0) {
        // Day
        formattedVal += currentDigits.slice(0, 2);

        // Add slash if we have more than 2 digits OR if we have 2 digits and user typed a slash
        if (
          currentDigits.length > 2 ||
          (currentDigits.length === 2 && val.includes("/"))
        ) {
          formattedVal += "/";
        }

        // Month
        if (currentDigits.length > 2) {
          formattedVal += currentDigits.slice(2, 4);

          // Add slash if we have more than 4 digits OR if we have 4 digits and user typed a second slash
          if (
            currentDigits.length > 4 ||
            (currentDigits.length === 4 && val.split("/").length > 2)
          ) {
            formattedVal += "/";
          }
        }

        // Year
        if (currentDigits.length > 4) {
          formattedVal += currentDigits.slice(4, 8);
        }
      }

      setInputValue(formattedVal);
      validateDate(formattedVal);
    };

    return (
      <div className={cn("relative", isShaking && "animate-shake")}>
        <Input
          startContent={
            Icon ? (
              <Icon className="text-muted-foreground h-4 w-4" {...iconProps} />
            ) : null
          }
          ref={inputRef}
          type="text"
          placeholder="DD/MM/YYYY"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={10}
          className={cn("font-medium", className)}
          aria-invalid={!!error}
          {...props}
        />
      </div>
    );
  }
);
MaskedDateInput.displayName = "MaskedDateInput";
