"use client";

import { Button } from "@/shared/ui/button";
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Lỗi quản trị hệ thống</h2>
      <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
        Đã có lỗi xảy ra khi tải dữ liệu quản trị. Vui lòng thử lại hoặc liên hệ quản trị viên.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Thử lại
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/admin">
            <LayoutDashboard className="h-4 w-4" />
            Về Dashboard
          </Link>
        </Button>
      </div>
      {error.digest && (
        <p className="text-muted-foreground/40 mt-6 font-mono text-xs">
          Digest: {error.digest}
        </p>
      )}
    </div>
  );
}
