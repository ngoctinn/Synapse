"use client";

import { cn } from "@/shared/lib/utils";
import { HStack } from "@/shared/ui/layout/stack";
import React from "react";

interface DataTableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchField?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DataTableToolbar({
  className,
  searchField,
  filters,
  actions,
  ...props
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-muted/5 px-4 py-3",
        className
      )}
      {...props}
    >
      <HStack gap={3} className="flex-1 items-center">
        {searchField && <div className="w-full max-w-[280px]">{searchField}</div>}
        {filters && <HStack gap={2}>{filters}</HStack>}
      </HStack>

      {actions && (
        <HStack gap={2} className="items-center">
          {actions}
        </HStack>
      )}
    </div>
  );
}
