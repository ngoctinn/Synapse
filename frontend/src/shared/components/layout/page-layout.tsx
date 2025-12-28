"use client";

import { useHeader } from "@/shared/lib/header-context";
import { cn } from "@/shared/lib/utils";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

// --- Page Shell ---
interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export function PageShell({
  className,
  animate = true,
  children,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4",
        animate && "page-entry-animation",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Page Header (Bây giờ là một Controller và Portal Target) ---
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function PageHeader({
  children,
  title,
  subtitle,
}: PageHeaderProps) {
  const { setHeader, clearHeader, tabsSlot } = useHeader();

  useEffect(() => {
    // Chỉ set title và subtitle qua context
    setHeader({
      title,
      subtitle,
    });

    return () => clearHeader();
  }, [title, subtitle, setHeader, clearHeader]);

  // Sử dụng Portal để đưa children lên Header mà không làm đứt gãy React Tree
  if (!tabsSlot || !children) return null;

  return createPortal(children, tabsSlot);
}

// --- Sticky Header ---
interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function StickyHeader({
  className,
  children,
  ...props
}: StickyHeaderProps) {
  return (
    <div
      className={cn(
        "bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Page Content ---
interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export function PageContent({
  className,
  children,
  fullWidth = false,
  ...props
}: PageContentProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col",
        !fullWidth && "gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Surface Card ---
type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement>;

export function SurfaceCard({
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "surface-card relative flex flex-1 flex-col overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
