"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra hệ thống giám sát (ví dụ: Sentry)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardContent className="pt-10 pb-8">
          <div className="bg-destructive/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-10 w-10" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight">Đã có lỗi xảy ra!</h2>
          <p className="text-muted-foreground mt-3 mb-8 px-4">
            Chúng tôi xin lỗi vì sự cố này. Hệ thống đã ghi nhận lỗi và đang được xử lý.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button 
              onClick={() => reset()} 
              variant="default"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Thử lại
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {error.digest && (
        <p className="text-muted-foreground/50 mt-4 text-xs font-mono">
          Mã lỗi: {error.digest}
        </p>
      )}
    </div>
  );
}
