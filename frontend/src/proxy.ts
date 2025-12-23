import { updateSession } from "@/shared/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Khớp tất cả các đường dẫn yêu cầu ngoại trừ các đường dẫn bắt đầu bằng:
     * - _next/static (tệp tĩnh)
     * - _next/image (tệp tối ưu hóa hình ảnh)
     * - favicon.ico (tệp favicon)
     * - images/ (hình ảnh công khai)
     * Bạn có thể thoải mái sửa đổi mẫu này để bao gồm thêm nhiều đường dẫn hơn.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
