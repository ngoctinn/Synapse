"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function usePasswordVisibility() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  const inputType = show ? "text" : "password";
  const Icon = show ? EyeOff : Eye;
  const ariaLabel = show ? "Ẩn mật khẩu" : "Hiện mật khẩu";
  return { show, toggle, inputType, Icon, ariaLabel };
}
