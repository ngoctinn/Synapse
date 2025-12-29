import { Button } from "@/shared/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-primary/10 select-none text-[150px] font-black leading-none sm:text-[200px]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 rounded-full p-4 backdrop-blur-sm">
            <Search className="text-primary h-12 w-12" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight">Không tìm thấy trang</h2>
      <p className="text-muted-foreground mt-4 mb-10 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một địa chỉ khác.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="outline" asChild className="gap-2">
          <Link href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <Button variant="default" asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
