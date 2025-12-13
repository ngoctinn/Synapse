"use client"

import { cn } from "@/shared/lib/utils"
import * as React from "react"
import { RequiredMark } from "./required-mark"

export interface FormFieldLayoutProps {
  /** Field label text */
  label: string
  /** Whether the field is required */
  required?: boolean
  /** Helper text shown below the field */
  helperText?: string
  /** Error message (overrides helperText when present) */
  error?: string
  /** The form control element */
  children: React.ReactNode
  /** Additional className for the container */
  className?: string
  /** Label className override */
  labelClassName?: string
}

/**
 * FormFieldLayout - Wrapper thống nhất cho form fields
 * Chuẩn hóa required marker (*), consistent helper/error placement, và spacing
 */
export function FormFieldLayout({
  label,
  required = false,
  helperText,
  error,
  children,
  className,
  labelClassName,
}: FormFieldLayoutProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        className={cn(
          "text-sm font-medium leading-none text-foreground/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          labelClassName
        )}
      >
        {label}
        {required && <RequiredMark />}
      </label>

      {children}

      {error ? (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}
