import { Button } from '@/shared/ui'
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Lỗi Xác Thực</h1>
        <p className="mb-6 text-slate-600">
          Đã xảy ra lỗi trong quá trình xác thực hoặc liên kết đã hết hạn.
          <br />
          Vui lòng thử lại quy trình.
        </p>
        <Link href="/login" className="w-full block">
          <Button className="w-full">
            Quay lại trang đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  )
}
