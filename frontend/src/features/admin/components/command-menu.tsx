"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/ui/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-md bg-background text-sm font-normal text-muted-foreground sm:pr-12 md:w-64 shadow-sm"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span className="hidden lg:inline-flex">Tìm kiếm...</span>
        <span className="inline-flex lg:hidden">Tìm kiếm...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Nhập từ khóa để tìm kiếm..." />
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
          <CommandGroup heading="Liên kết nhanh">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard"))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/customers"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Khách hàng</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/staff"))}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Nhân viên</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/services"))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Dịch vụ</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cài đặt">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/settings"))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/settings/billing"))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Thanh toán</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt chung</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
