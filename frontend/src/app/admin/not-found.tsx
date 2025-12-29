import { Button } from "@/shared/ui/button";
import { FileQuestion, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <FileQuestion className="text-muted-foreground h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Không tìm thấy nội dung</h2>
      <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
        Trang quản trị bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.
      </p>
      <Button asChild className="gap-2">
        <Link href="/admin">
          <LayoutDashboard className="h-4 w-4" />
          Về Dashboard
        </Link>
      </Button>
    </div>
  );
}
