"use client";

import { cn } from "@/shared/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import * as React from "react";

export interface FormTabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FormTabsProps {
  /** Array of tab items */
  tabs: FormTabItem[];
  /** Default selected tab value */
  defaultValue?: string;
  /** Controlled value */
  value?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
  /** Render function for tab content */
  children: React.ReactNode;
  /** Additional className for the container */
  className?: string;
  /** Additional className for the tabs list */
  listClassName?: string;
}

/**
 * FormTabs - Reusable tabbed interface for forms
 * Định nghĩa style tokens chuẩn: h-11, padding, active bg/shadow
 * Title Case naming convention
 */
export function FormTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  listClassName,
}: FormTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn("flex h-full w-full flex-col", className)}
    >
      <TabsList
        className={cn(
          // Standard form tabs styling
          "bg-muted/60 mb-4 grid h-11 w-full shrink-0 rounded-lg p-1",
          listClassName
        )}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

// Re-export TabsContent for convenience
export { TabsContent as FormTabsContent };
