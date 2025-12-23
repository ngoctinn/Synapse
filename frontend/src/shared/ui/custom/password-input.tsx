"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import * as React from "react";
import { Input, InputProps } from "../input";
import { cn } from "@/shared/lib/utils";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showIcon?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, showIcon = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Input
      type={showPassword ? "text" : "password"}
      className={cn("hide-password-toggle pr-10", className)}
      startContent={
        showIcon ? <Lock className="text-muted-foreground size-4" /> : undefined
      }
      endContent={
        <button
          type="button"
          onClick={togglePassword}
          className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      }
      ref={ref}
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";
