import { useEffect, useState } from "react";

/**
 * useHasHydrated
 *
 * Một hook đơn giản để kiểm tra xem component đã hoàn tất quá trình hydration trên client hay chưa.
 * Hữu ích cho việc tránh lỗi mismatch giữa Server-side Rendering (SSR) và Client-side Rendering (CSR),
 * đặc biệt là khi làm việc với các giá trị từ localStorage hoặc window object.
 */
export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
}
