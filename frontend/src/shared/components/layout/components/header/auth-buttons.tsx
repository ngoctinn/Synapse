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
          <Button variant="outline" className="w-full justify-center rounded-xl h-11">
            Đăng nhập
          </Button>
        </Link>
        <Link href="/register" onClick={onActionClick} className="w-full">
          <Button className="w-full justify-center rounded-xl h-11 shadow-md shadow-primary/20">
            Đăng ký ngay
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/login">
        <Button variant="link" size="sm" className="rounded-full text-muted-foreground hover:text-primary">
          Đăng nhập
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
          Đăng ký ngay
        </Button>
      </Link>
    </div>
  )
}
