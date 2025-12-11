"use client"

import { Button } from "@/shared/ui/button"
import Link from "next/link"

interface HeaderAuthButtonsProps {
  mobile?: boolean
  onActionClick?: () => void
}

export function HeaderAuthButtons({ mobile = false, onActionClick }: HeaderAuthButtonsProps) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <Link href="/login" onClick={onActionClick} className="w-full">
          <Button variant="outline" size="lg" className="w-full justify-center">
            Đăng nhập
          </Button>
        </Link>
        <Link href="/register" onClick={onActionClick} className="w-full">
          <Button size="lg" className="w-full justify-center">
            Đăng ký ngay
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/login">
        <Button variant="link" size="sm">
          Đăng nhập
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">
          Đăng ký ngay
        </Button>
      </Link>
    </div>
  )
}
