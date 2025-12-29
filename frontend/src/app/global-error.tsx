"use client";

import { Button } from "@/shared/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sự cố hệ thống nghiêm trọng</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Ứng dụng gặp lỗi không thể tự phục hồi. Vui lòng tải lại trang.
          </p>
          <Button onClick={() => reset()} size="lg">
            Tải lại ứng dụng
          </Button>
          {error.digest && (
            <p className="mt-4 text-xs font-mono opacity-50">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
