"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

interface UseFilterParamsOptions {
  /**
   * Danh sách các key params cần theo dõi để đếm số lượng filter đang active
   */
  filterKeys?: string[]
  /**
   * Callback tùy chỉnh khi clear filter (nếu cần xử lý thêm ngoài việc xóa params)
   */
  onClear?: () => void
}

export function useFilterParams(options: UseFilterParamsOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { filterKeys = [] } = options

  // Tính toán số lượng filter đang active
  const activeCount = useMemo(() => {
    let count = 0
    filterKeys.forEach((key) => {
      if (searchParams.has(key)) {
        count++
      }
    })
    return count
  }, [searchParams, filterKeys])

  // Tạo query string mới
  const createQueryString = useCallback(
    (params: URLSearchParams) => {
      // Luôn reset về trang 1 khi filter thay đổi
      params.set("page", "1")
      return params.toString()
    },
    []
  )

  // Cập nhật một param cụ thể
  const updateParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      router.push(`${pathname}?${createQueryString(params)}`)
    },
    [pathname, router, searchParams, createQueryString]
  )

  // Cập nhật nhiều params cùng lúc
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.push(`${pathname}?${createQueryString(params)}`)
    },
    [pathname, router, searchParams, createQueryString]
  )

  // Xóa toàn bộ filter
  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    filterKeys.forEach((key) => {
      params.delete(key)
    })
    params.set("page", "1")
    
    if (options.onClear) {
      options.onClear()
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams, filterKeys, options])

  return {
    searchParams,
    activeCount,
    updateParam,
    updateParams,
    clearFilters,
  }
}
