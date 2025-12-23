import { Suspense } from "react";
import { HeaderContainer } from "./header-container";
import { HeaderSkeleton } from "./skeleton";

/**
 * Header với Suspense wrapper - cho phép streaming và hiển thị skeleton
 * trong khi đang fetch user profile từ backend.
 *
 * Giải quyết vấn đề delay sau đăng nhập bằng cách:
 * - Hiển thị skeleton ngay lập tức
 * - Stream nội dung Header thực khi API trả về
 */
export function HeaderWithSuspense() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContainer />
    </Suspense>
  );
}
